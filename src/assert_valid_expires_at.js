/**
 * Ensures that the provided value is a date pointing to the future.
 */
function assert_valid_expires_at(expires_at)
{
    if (expires_at instanceof Date) {
        if (expires_at.getTime() > Date.now()) {
            return;
        }
    }
    throw new Error('Invalid value for expires_at; it should be a Date object pointing to the future.');
}

module.exports = assert_valid_expires_at;
