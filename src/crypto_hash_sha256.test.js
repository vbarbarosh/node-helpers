import crypto_hash_sha256 from './crypto_hash_sha256';
import assert from 'assert';

describe('crypto_hash_sha256', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(crypto_hash_sha256('').toString('hex'), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
        assert.deepStrictEqual(crypto_hash_sha256('1').toString('hex'), '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b');
        assert.deepStrictEqual(crypto_hash_sha256('hello').toString('hex'), '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });
});
