import fs from 'fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH));
const labels = event.pull_request?.labels || [];

const agentLabel = labels.find(l => l.name.startsWith('agent:'));
if (!agentLabel) {
  console.error('No agent label found');
  process.exit(1);
}

const agent = agentLabel.name.replace('agent:', '');
fs.writeFileSync('agent-name.txt', agent);
console.log(`Agent: ${agent}`);
