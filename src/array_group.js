import array_group_map from './array_group_map';

/**
 * Group items by common key and return an array of groups.
 *
 * @param array
 * @param fn
 * @returns {unknown[]}
 */
function array_group(array, fn)
{
    return Object.values(array_group_map(array, fn));
}

export default array_group;
