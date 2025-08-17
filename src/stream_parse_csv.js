const csv_parse = require('csv-parse');

/**
 * Parse input stream as CSV data.
 *
 * @link https://csv.js.org/parse/options/
 */
function stream_parse_csv({delimiter = ',', relax_column_count = false} = {})
{
    return csv_parse.parse({delimiter, relax_column_count, });
}

module.exports = stream_parse_csv;
