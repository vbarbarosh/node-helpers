const assert = require('assert');
const fcmp_from_spec = require('./fcmp_from_spec');

describe('fcmp_from_spec', function () {
    it('basic [id] • sort by id (asc)', function () {
        const actual = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
        ];
        actual.sort(fcmp_from_spec(['id']));
        const expected = [
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
            {id: 3, name: 'Banana', price: 8.25},
        ];
        assert.deepStrictEqual(actual, expected);
    });
    it('basic [-id] • sort by id (desc)', function () {
        const actual = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
        ];
        actual.sort(fcmp_from_spec(['-id']));
        const expected = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 2, name: 'Cherry', price: 15.49},
            {id: 1, name: 'Apple', price: 10.99},
        ];
        assert.deepStrictEqual(actual, expected);
    });
    it('basic [name] • sort by name (asc)', function () {
        const actual = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
        ];
        actual.sort(fcmp_from_spec(['name']));
        const expected = [
            {id: 1, name: 'Apple', price: 10.99},
            {id: 3, name: 'Banana', price: 8.25},
            {id: 2, name: 'Cherry', price: 15.49},
        ];
        assert.deepStrictEqual(actual, expected);
    });
    it('basic [-name] • sort by name (desc)', function () {
        const actual = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
        ];
        actual.sort(fcmp_from_spec(['-name']));
        const expected = [
            {id: 2, name: 'Cherry', price: 15.49},
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
        ];
        assert.deepStrictEqual(actual, expected);
    });
    it('compound [price,name] • sort by price (asc), name (asc)', function () {
        const actual = [
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 10.99},
            {id: 3, name: 'Banana', price: 8.25},
        ];
        actual.sort(fcmp_from_spec(['price', 'name']));
        const expected = [
            {id: 3, name: 'Banana', price: 8.25},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 10.99},
        ];
        assert.deepStrictEqual(actual, expected);
    });
    it('compound [-price,name,id] • sort by price (desc), name (asc), id (asc)', function () {
        const actual = [
            {id: 1, name: 'Apple', price: 10.99},
            {id: 2, name: 'Cherry', price: 15.49},
            {id: 3, name: 'Banana', price: 8.25},
            {id: 4, name: 'Banana', price: 8.25},
        ];
        actual.sort(fcmp_from_spec(['-price', 'name', 'id']));
        const expected = [
            {id: 2, name: 'Cherry', price: 15.49},
            {id: 1, name: 'Apple', price: 10.99},
            {id: 3, name: 'Banana', price: 8.25},
            {id: 4, name: 'Banana', price: 8.25},
        ];
        assert.deepStrictEqual(actual, expected);
    });
});
