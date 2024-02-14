// https://github.com/nodejs/node/issues/36084#issuecomment-729894622
class Abort extends Error
{
    constructor(message = 'The operation was aborted') {
        super(message);
        this.name = 'AbortError';
        this.code = 'ABORT_ERR';
    }

    static absorb(error) {
        if (AbortError.check(error)) {
            return;
        }
        throw error;
    }

    static check(error) {
        return error
            && (error.name === 'AbortError')
            && (error.code === 'ABORT_ERR');
    }
}

module.exports = Abort;
