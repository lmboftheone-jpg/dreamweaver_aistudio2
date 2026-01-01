import React, { useEffect, useState } from 'react';
import { StateService, CIState, AuditEntry } from '../../services/stateService';

const CIDashboard: React.FC = () => {
    const [states, setStates] = useState<CIState[]>([]);
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = async () => {
        setLoading(true);
        try {
            const [data, logData] = await Promise.all([
                StateService.getAllStates(),
                StateService.getAuditLogs()
            ]);
            setStates(data);
            setLogs(logData);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch CI states", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Optional: Poll every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateState = async (id: string, newStatus: string) => {
        try {
            // Optimistic update
            setStates(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as any } : s));

            await StateService.updateState(id, { status: newStatus as any }, 'dashboard_user');

            // Refresh to get full sync/updates
            fetchData();
        } catch (error) {
            console.error("Failed to update state", error);
            alert("Failed to update state. See console.");
            fetchData(); // Revert
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            case 'IN_PROGRESS': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
            case 'RESOLVED': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'CLOSED': return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
            case 'BLOCKED': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            case 'HUMAN_ONLY': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
            case 'RETRYING': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-4xl text-primary">dns</span>
                        State Engine Dashboard
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Single Source of Truth for CI/CD, Issues, and PRs
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Source</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {states.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No active states found in the State Engine.
                                    </td>
                                </tr>
                            ) : (
                                states.map((state) => (
                                    <tr key={state.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-500">{state.id}</td>
                                        <td className="p-4">
                                            <span className="uppercase text-xs font-bold text-gray-400 tracking-wider">
                                                {state.type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(state.status)}`}>
                                                {state.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center gap-2">
                                            {state.source === 'github' && <span className="material-symbols-outlined text-gray-400 text-lg">code</span>}
                                            {state.source === 'slack' && <span className="material-symbols-outlined text-gray-400 text-lg">chat</span>}
                                            <span className="text-gray-700 dark:text-gray-300 capitalize">{state.source}</span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100 max-w-md truncate">
                                            {state.title || "Untitled"}
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {state.status !== 'RETRYING' && state.status !== 'CLOSED' && state.status !== 'RESOLVED' && (
                                                <button
                                                    onClick={() => handleUpdateState(state.id, 'RETRYING')}
                                                    className="px-3 py-1 text-xs font-bold text-orange-600 bg-orange-100 rounded hover:bg-orange-200 transition-colors"
                                                    title="Retry"
                                                >
                                                    Retry
                                                </button>
                                            )}
                                            {state.status !== 'CLOSED' && (
                                                <button
                                                    onClick={() => handleUpdateState(state.id, 'CLOSED')}
                                                    className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                    title="Close"
                                                >
                                                    Close
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Audit Log Section */}
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">history</span>
                    Recent Activity Audit
                </h3>
                <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Time</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actor</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Entity ID</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Source</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No recent activity logged.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                            <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                                {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                                            </td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                                {log.actor}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-blue-500 font-mono">
                                                {log.entity_id}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {log.source}
                                            </td>
                                            <td className="p-4 text-xs text-gray-400 font-mono max-w-xs truncate">
                                                {JSON.stringify(log.payload)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CIDashboard;
