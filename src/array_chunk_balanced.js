const clamp = require('./clamp');

/**
 * Split an array into up to `max_chunks` balanced chunks, while ensuring that
 * each chunk contains at least `min_items_per_chunk` items (when possible).
 *
 * The function distributes items as evenly as possible:
 * - Chunk sizes differ by at most 1 item.
 * - The number of chunks never exceeds `max_chunks`.
 *
 * Originally designed for distributing workload across threads
 * (e.g. `array_chunk_balanced(jobs, max_threads, min_jobs_per_thread)`).
 *
 * Edge cases:
 * - If the input array is empty → returns [].
 * - If there are too few items to satisfy `min_items_per_chunk`, even for a single
 *   chunk, all items are placed into one chunk.
 *
 * @param {Array} array
 * @param {number} max_chunks
 * @param {number} min_items_per_chunk
 * @returns {Array<Array>}
 */
function array_chunk_balanced(array = [], max_chunks = 1, min_items_per_chunk = 1)
{
    const total_chunks = clamp(1, max_chunks, Math.floor(array.length / min_items_per_chunk));
    const items_per_chunk = Math.floor(array.length / total_chunks);
    let extra = array.length % total_chunks;

    const out = [];
    for (let i = 0; i < array.length; ) {
        const size = items_per_chunk + (extra ? 1 : 0);
        out.push(array.slice(i, i + size));
        i += size;
        if (extra) {
            extra--;
        }
    }
    return out;
}

module.exports = array_chunk_balanced;
