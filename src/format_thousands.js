// https://stackoverflow.com/a/2901298
function format_thousands(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = format_thousands;
