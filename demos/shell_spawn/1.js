const cli = require('../../src/cli');
const shell_spawn = require('../../src/shell_spawn');

cli(main);

async function main()
{
    // https://test-videos.co.uk/sintel/mp4-h264
    await shell_spawn(['wget', '-O', 'a.mp4', 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_10MB.mp4'], {stdio: 'inherit'}).promise();
    await shell_spawn(['ffmpeg', '-i', 'a.mp4', '-filter:v', 'setpts=0.2*PTS', '-y', 'b.mp4'], {stdio: 'inherit'}).promise();
    console.log('done');
}
