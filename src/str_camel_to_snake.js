function str_camel_to_snake(s)
{
    return s
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')  // Insert underscore between lowercase/number and uppercase
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2') // Separate acronyms from regular CamelCase words
        .toLowerCase();
}

module.exports = str_camel_to_snake;
