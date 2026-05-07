// read, write, refresh
async function cache({get, set, refresh})
{
    try {
        return await get();
    }
    catch {
    }

    const value = await refresh();
    await set(value);
    return value;
}

module.exports = cache;
