const fs = require('fs');

const ctx = JSON.parse(fs.readFileSync('issue-context.json', 'utf8'));

let tests = [];

// 기본 Smoke Test
tests.push({
    id: 'SMOKE_HOME',
    type: 'smoke',
    title: '홈 페이지 접근',
    steps: [
        { action: 'goto', target: '/' },
        { action: 'expectVisible', target: 'body' }
    ]
});

// Expected Result 기반 분기
if (ctx.expected.fullPass || ctx.expected.failScore) {
    tests.push({
        id: 'CRITICAL_MAIN_FLOW',
        type: 'critical',
        title: '메인 핵심 플로우',
        steps: [
            { action: 'goto', target: '/' },
            { action: 'click', target: '[data-testid=main-action]' },
            { action: 'expectVisible', target: '[data-testid=result]' }
        ]
    });
}

// 강제 실패 시나리오
if (ctx.flags.forceCriticalFail) {
    tests.push({
        id: 'FORCED_FAIL',
        type: 'critical',
        title: '강제 실패 테스트',
        steps: [
            { action: 'goto', target: '/not-exist' },
            { action: 'expectVisible', target: 'text=404' }
        ]
    });
}

const out = {
    meta: {
        source: 'issue',
        agent: ctx.agent,
        expected: ctx.expected
    },
    tests
};

fs.writeFileSync('test-cases.json', JSON.stringify(out, null, 2));
console.log('Test cases generated from issue');
