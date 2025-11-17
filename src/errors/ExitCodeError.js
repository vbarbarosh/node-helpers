class ExitCodeError extends Error
{
    constructor(exit_code, message = '') {
        super(message);
        this.exit_code = exit_code;
    }
}

module.exports = ExitCodeError;
