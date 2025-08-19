const assert = require('assert');
const fcmpx = require('./fcmpx');

const users = [
    {id: 'fred|48|100', user: {name: 'fred', age: 48, balance: 100}},
    {id: 'barney|36|-200', user: {name: 'barney', age: 36, balance: -200}},
    {id: 'wilma|-|-', user: {name: 'wilma', tag: {short: 'foo', long: 'foofoo'}}},
    {id: 'betty|32|-', user: {name: 'betty', tag: {short: 'bar', long: 'barbar'}, age: 32}},
];

const projects = [
    {id: 3, title: 'Project 10', priority: 'high', progress: 75, tags: ['development', 'backend'], version: '1.2.9', owner: 'Alice'},
    {id: 1, title: 'Project 2', priority: 'low', progress: 20, tags: ['design'], version: '1.10.0'},
    {id: 5, title: 'Project 1', priority: 'medium', progress: 45, tags: ['frontend', 'design'], version: '2.1.0'},
    {id: 2, title: 'Project 100', priority: 'high', progress: 90, tags: ['development', 'frontend'], version: '1.2.10'},
    {id: 4, title: 'project 5', priority: 'critical', progress: 10, tags: ['bugfix'], version: '1.0.0', owner: 'Charlie'},
    {id: 6, title: 'Alpha Task', priority: 'medium', progress: 60, tags: ['documentation'], version: '1.20.1'},
    {id: 7, title: 'beta Task', priority: 'low', progress: 30, tags: ['testing'], version: '0.9.5'},
    {id: 8, title: 'Project 20', priority: 'high', progress: 100, tags: ['deployment'], version: '2.0.0'},
    {id: 9, title: 'Project 02', priority: 'low', progress: 55, tags: ['archive'], version: '1.2.0'},
    {id: 10, title: 'Project 001', priority: 'medium', progress: 5, tags: ['legacy'], version: '1.2.0-beta'},
    {id: 11, title: 'project 0005', priority: 'high', progress: 85, tags: ['migration'], version: '1.2.0-rc.1', owner: 'Dana'},
    {id: 12, title: 'Project X', priority: 'critical', progress: 0, tags: ['secret'], version: '3.0.0-alpha', owner: 'Eve'},
];

const tests = [
    {
        description: 'missing: should move undefined values to the bottom',
        items: [
            {id: 'user1', user: {age: 48}},
            {id: 'user2', user: {age: 36}},
            {id: 'user3'},
            {id: 'user4', user: {age: 32}},
        ],
        extract: v => v.id,
        expressions: [
            'user.age',
            v => v.user?.age,
            {read: 'user.age'},
            {read: v => v.user?.age},
            ['user.age'],
            [v => v.user?.age],
            [{read: 'user.age'}],
            [{read: v => v.user?.age}],
        ],
        expected: ['user4', 'user2', 'user1', 'user3'],
    },
    {
        description: 'missing: should move undefined values to the bottom #2',
        items: [
            {id: 'user1', user: {age: 48}},
            {id: 'user2', user: {age: 36}},
            {id: 'user3', user: {tag: {short: 'foo'}}},
            {id: 'user4', user: {tag: {short: 'bar'}, age: 32}},
        ],
        extract: v => v.id,
        expressions: [
            'user.age,user.tag.short',
            ['user.age', 'user.tag.short'],
            [v => v.user.age, v => v.user.tag?.short],
            [{read: 'user.age'}, {read: 'user.tag.short'}],
            [{read: v => v.user.age}, {read: v => v.user.tag?.short}],
        ],
        expected: ['user4', 'user2', 'user1', 'user3'],
    },
    {
        description: 'missing: should move undefined values to the bottom and keep their initial order',
        items: [
            {id: 'user1', user: {balance: 100}},
            {id: 'user2', user: {balance: -200}},
            {id: 'user3'},
            {id: 'user4'},
        ],
        extract: v => v.id,
        expressions: [
            'user.balance',
            v => v.user?.balance,
            [v => v.user?.balance],
        ],
        expected: ['user2', 'user1', 'user3', 'user4'],
    },
    {
        description: 'move undefined value to the bottom, keep their initial order',
        items: users,
        extract: v => v.id,
        expressions: [
            'user.balance,user.age',
            [v => v.user.balance, v => v.user.age],
        ],
        expected: ['barney|36|-200', 'fred|48|100', 'betty|32|-', 'wilma|-|-'],
    },
    {
        description: 'move undefined value to the bottom, keep their initial order',
        items: users,
        extract: v => v.id,
        expressions: [
            'user.balance,user.age',
            [v => v.user.balance, v => v.user.age],
        ],
        expected: ['barney|36|-200', 'fred|48|100', 'betty|32|-', 'wilma|-|-'],
    },
    {
        description: 'user.tag.short',
        items: [
            {user: {name: 'fred', age: 48}},
            {user: {name: 'barney', age: 36}},
            {user: {name: 'wilma', tag: {short: 'foo'}}},
            {user: {name: 'betty', tag: {short: 'bar'}, age: 32}},
        ],
        extract: v => `${v.user.name}|${v.user.tag?.short ?? '-'}`,
        expressions: [
            'user.tag.short',
            v => v.user.tag?.short,
            [v => v.user.tag?.short],
        ],
        expected: ['betty|bar', 'wilma|foo', 'fred|-', 'barney|-'],
    },
    {
        description: 'user.tag.short,user.age',
        items: [
            {user: {name: 'fred', age: 48}},
            {user: {name: 'barney', age: 36}},
            {user: {name: 'wilma', tag: {short: 'foo'}}},
            {user: {name: 'betty', tag: {short: 'bar'}, age: 32}},
        ],
        extract: v => `${v.user.name}|${v.user.tag?.short ?? ''}|${v.user.age ?? ''}`,
        expressions: [
            'user.tag.short,user.age',
            ['user.tag.short', 'user.age'],
            [v => v.user.tag?.short, v => v.user.age],
        ],
        expected: ['betty|bar|32', 'wilma|foo|', 'barney||36', 'fred||48'],
    },
    {
        description: 'top: move specified values to the top',
        items: [
            {id: 'task1', priority: 'normal'},
            {id: 'task2', priority: 'low'},
            {id: 'task3', priority: 'high'},
            {id: 'task4', priority: 'normal'},
        ],
        extract: v => `${v.id}:${v.priority}`,
        expressions: [
            {read: 'priority', top: ['high']},
        ],
        expected: ['task3:high', 'task1:normal', 'task2:low', 'task4:normal'],
    },
    {
        description: 'top: move specified values to the top #2',
        items: [
            {id: 'task1', priority: 'normal'},
            {id: 'task2', priority: 'low'},
            {id: 'task3', priority: 'high'},
            {id: 'task4', priority: 'normal'},
        ],
        extract: v => `${v.id}:${v.priority}`,
        expressions: [
            {read: 'priority', top: ['high', 'normal', 'low']},
        ],
        expected: ['task3:high', 'task1:normal', 'task4:normal', 'task2:low'],
    },
];

describe('fcmpx', function () {
    tests.forEach(function (test) {
        test.expressions.forEach(function (expr, i) {
            it(`${test.description}: #${i + 1} | ${test.description}`, function () {
                const actual = test.items.slice().sort(fcmpx(expr)).map(test.extract);
                assert.deepStrictEqual(actual, test.expected);
            });
        });
    });
});
