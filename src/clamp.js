function clamp(min, max, value)
{
    return Math.max(min, Math.min(max, value));
}

module.exports = clamp;
