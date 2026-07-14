const assert = require('assert');
const sftp_get_file_info = require('./sftp_get_file_info');

describe('sftp_get_file_info', function () {
    it('should accept a single argument', async function () {
        // A closed local port: the call must get past options destructuring
        // and fail with a connection error, not a TypeError.
        await assert.rejects(sftp_get_file_info('sftp://user:pass@127.0.0.1:9/x'), function (error) {
            assert(!(error instanceof TypeError), `got TypeError: ${error.message}`);
            return true;
        });
    });
});
