class UserFriendlyError extends Error
{
    constructor(message) {
        super(message);
    }
}

module.exports = UserFriendlyError;
