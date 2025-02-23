#!/usr/bin/env node

const axios = require('axios');
const cli = require('../../cli');
const express = require('express');
const fs_path_resolve = require('../../fs_path_resolve');
const fs_write = require('../../fs_write');
const json_stringify_safe = require('../../json_stringify_safe');

cli(main);

async function main()
{
    const app = express();
    app.get('/', (req, res) => {});
    const server = app.listen(3000);

    try {
        await axios('http://127.0.0.1:3000', {timeout: 1});
    }
    catch (error) {
        await fs_write(fs_path_resolve(__dirname, '../1.json'), json_stringify_safe(error, null, 4).replaceAll(fs_path_resolve(__dirname, '../../../..'), '/app'));
    }

    server.close();
}
