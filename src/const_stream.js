// Since Node.js streams cannot emit `null` values (it's an eof mark),
// this is a workaround.

const const_stream = {
    null: Symbol('stream[null]'),
};

module.exports = const_stream;
