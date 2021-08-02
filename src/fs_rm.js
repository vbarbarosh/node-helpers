import fs from 'fs';
import util from 'util';

// https://nodejs.org/api/util.html#util_util_promisify_original
export default util.promisify(fs.unlink);
