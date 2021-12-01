/**
 * Shuffles an array using Durstenfeld shuffle algorithm.
 *
 * Note: This function performs shuffle in-place. In order
 * to get a shuffled copy use call slice before calling, e.g.
 * array_shuffle(items.slice()).
 *
 * @param array
 * @returns array
 * @link https://stackoverflow.com/a/6274381/1478566
 * @link https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function array_shuffle(array)
{
    for (let i = array.length; --i > 0; ) {
        const j = Math.floor(Math.random() * (i + 1));
        const x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

export default array_shuffle;
