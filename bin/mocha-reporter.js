const Mocha = require('mocha');

/**
 * The reporter of the test runs: mocha's own `spec`, and under GitHub Actions
 * each failed test also becomes an annotation of the run, so that what failed
 * can be read on the run's page without opening its log.
 *
 * ::error title=fastdl should download a file::Timeout of 2000ms exceeded.
 */
class Reporter extends Mocha.reporters.Spec
{
    constructor(runner, options)
    {
        super(runner, options);
        if (process.env.GITHUB_ACTIONS !== 'true') {
            return;
        }
        runner.on(Mocha.Runner.constants.EVENT_TEST_FAIL, function (test, error) {
            const title = test.fullTitle();
            const message = String(error?.message ?? error).split('\n').slice(0, 5).join('\n');
            console.log(`::error title=${escape_property(title)}::${escape_data(message)}`);
        });
    }
}

// https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions
function escape_data(value)
{
    return value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escape_property(value)
{
    return escape_data(value).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

module.exports = Reporter;
