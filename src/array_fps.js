const round = require('./round');

const EPS = 0.00001;

function array_fps(duration_sec, fps)
{
    const total_frames = Math.floor(duration_sec * fps);

    if (total_frames <= 1) {
        return [0];
    }

    const out = [];
    for (let i = 0; i < total_frames; ++i) {
        out.push(round((i / (total_frames - 1)) * (duration_sec - EPS), EPS));
    }
    return out;
}

module.exports = array_fps;
