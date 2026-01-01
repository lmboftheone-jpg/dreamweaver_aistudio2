import { createClient } from '@supabase/supabase-js';

// --- Types ---
export type CIStatus =
    | 'OPEN'
    | 'IN_PROGRESS'
    | 'RETRYING'
    | 'BLOCKED'
    | 'HUMAN_ONLY'
    | 'RESOLVED'
    | 'CLOSED';

export interface CIState {
    id: string; // "issue-42"
    type: 'issue' | 'pr' | 'incident';
    repo?: string;
    title?: string;
    status: CIStatus;
    source: 'github' | 'slack' | 'dashboard';
    assignee?: string;
    retry_count: number;
    last_error?: string;
    metadata?: Record<string, any>;
    updated_at?: string;
}

export interface AuditEntry {
    entity_id: string;
    action: string;
    actor: string;
    source: string;
    payload?: any;
    created_at?: string;
}

// --- Service ---
// Initialize client
// Use Service Role Key if available (Server-side) for full permissions
// Fallback to Anon Key (Client-side) for read-only (or policy-permitted) access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export class StateService {

    /**
     * Update the state of a CI entity.
     * This is the "State Engine" core logic.
     */
    static async updateState(
        id: string,
        updates: Partial<CIState>,
        actor: string
    ): Promise<CIState | null> {
        if (!supabase) {
            console.warn('Supabase not configured. updateState skipped.');
            return null;
        }

        // 1. Fetch current state to check for loops or invalid transitions
        const { data: current, error: fetchError } = await supabase
            .from('ci_state')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw fetchError;
        }

        // Loop Prevention: If source is same and status is same, ignore (simplified)
        if (current && current.source === updates.source && current.status === updates.status) {
            console.log(`[StateEngine] Loop detected/Redundant update for ${id}. Ignoring.`);
            return current as CIState;
        }

        // 2. Prepare payload
        const payload = {
            ...updates,
            updated_at: new Date().toISOString(),
        };

        // 3. Upsert State
        const { data: updated, error: upsertError } = await supabase
            .from('ci_state')
            .upsert({ id, ...payload, type: current?.type || updates.type || 'issue' }) // Ensure type exists on insert
            .select()
            .single();

        if (upsertError) throw upsertError;

        // 4. Create Audit Log
        await this.logAudit({
            entity_id: id,
            action: 'status_change',
            actor: actor,
            source: updates.source || 'unknown',
            payload: updates
        });

        return updated as CIState;
    }

    /**
     * create Audit Log entry
     */
    static async logAudit(entry: AuditEntry) {
        if (!supabase) return;

        await supabase.from('ci_audit_log').insert(entry);
    }

    /**
     * Get single state
     */
    static async getState(id: string): Promise<CIState | null> {
        if (!supabase) return null;

        const { data, error } = await supabase
            .from('ci_state')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as CIState;
    }

    /**
     * Get all states (for Dashboard)
     */
    static async getAllStates(): Promise<CIState[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('ci_state')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching all states:', error);
            return [];
        }
        return data as CIState[];
    }

    /**
     * Get recent audit logs
     */
    static async getAuditLogs(limit = 50): Promise<AuditEntry[]> {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('ci_audit_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching audit logs:', error);
            return [];
        }
        return data as AuditEntry[];
    }
}
