const assert = require('assert');
const fcmpx = require('./fcmpx');

const users = [
    {id: 'fred|48|100', user: {name: 'fred', age: 48, balance: 100}},
    {id: 'barney|36|-200', user: {name: 'barney', age: 36, balance: -200}},
    {id: 'wilma|-|-', user: {name: 'wilma', tag: {short: 'foo', long: 'foofoo'}}},
    {id: 'betty|32|-', user: {name: 'betty', tag: {short: 'bar', long: 'barbar'}, age: 32}},
];

// https://dummyjson.com/docs/products

const products = [
    {id: 1, name: 'Yoga Mat', category: 'Yoga', price: 25.99, brand: 'BalanceFrom', rating: 4.6, discount: 0.1, availability: 'in_stock'},
    {id: 2, name: 'Adjustable Dumbbells', category: 'Strength', price: 199.99, brand: 'Bowflex', rating: 4.8, availability: 'preorder'},
    {id: 3, name: 'Resistance Bands Set', category: 'Strength', price: 32.5, brand: 'Fit Simplify', rating: 4.5, discount: 0.15, availability: 'in_stock'},
    {id: 4, name: 'Treadmill', category: 'Cardio', price: 899, brand: 'NordicTrack', rating: 4.7, availability: 'out_of_stock'},
    {id: 5, name: 'Kettlebell 20lb', category: 'Strength', price: 45, brand: 'CAP Barbell', rating: 4.4, discount: 0.05, availability: 'in_stock'},
    {id: 6, name: 'Foam Roller', category: 'Recovery', price: 19.99, brand: 'TriggerPoint', rating: 4.6, availability: 'limited'},
    {id: 7, name: 'Exercise Bike', category: 'Cardio', price: 599, brand: 'Peloton', rating: 4.9, discount: 0.2, availability: 'in_stock'},
    {id: 8, name: 'Pull-Up Bar', category: 'Strength', price: 29.95, brand: 'Iron Gym', rating: 4.3, availability: 'in_stock'},
    {id: 9, name: 'Jump Rope', category: 'Cardio', price: 12.99, brand: 'WOD Nation', rating: 4.2, discount: 0.25, availability: 'limited'},
    {id: 10, name: 'Ab Roller', category: 'Core', price: 21.49, brand: 'Perfect Fitness', rating: 4.5, availability: 'in_stock'},
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
