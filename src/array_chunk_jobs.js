const clamp = require('./clamp');

/**
 * Split an array of jobs between up to `max_threads`, while trying to put at least
 * `min_jobs_per_thread` items into each chunk.
 *
 * - If an array is empty → returns [].
 * - If there are too few items to satisfy `min_items_per_chunk`, even for 1 chunk,
 *   everything goes into a single chunk.
 *
 * Alternative names:
 *   - array_chunk_balanced
 *
 * @param array
 * @param max_threads
 * @param min_jobs_per_thread
 * @returns {*[]}
 */
function array_chunk_jobs(array = [], max_threads = 1, min_jobs_per_thread = 1)
{
    const total_threads = clamp(1, max_threads, Math.floor(array.length / min_jobs_per_thread));
    const jobs_per_thread = Math.floor(array.length / total_threads);
    let extra = array.length % total_threads;

    const out = [];
    for (let i = 0; i < array.length; ) {
        const size = jobs_per_thread + (extra ? 1 : 0);
        out.push(array.slice(i, i + size));
        i += size;
        if (extra) {
            extra--;
        }
    }
    return out;
}

module.exports = array_chunk_jobs;
