vue_component('main-header', {
    template: `
        <div>
            <p>A set of helpers for JavaScript/Node.js</p>

            <p class="flex-row-center gap10">
                <a href="https://github.com/vbarbarosh/node-helpers/actions"><img src="https://github.com/vbarbarosh/node-helpers/actions/workflows/node.js.yml/badge.svg" alt="@vbarbarosh/node-helpers CI status" /></a>
                <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/vbarbarosh/node-helpers" alt="License" /></a>
                <a href="https://www.npmjs.com/package/@vbarbarosh/node-helpers" rel="nofollow"><img src="https://img.shields.io/npm/dw/@vbarbarosh/node-helpers.svg" alt="npm" /></a>
                <a href="https://github.com/vbarbarosh/node-helpers" rel="nofollow"><img src="https://img.shields.io/github/stars/vbarbarosh/node-helpers" alt="stars" /></a>
                </p>

            <p align="center">
                <img src="img/node-helpers-by-chat-gpt.webp" style="max-height:400px;" />
            </p>

            <div>
                <div class="rel"><copy-to-clipboard value="npm install @vbarbarosh/node-helpers" /></div>
                <prism-bash value="npm install @vbarbarosh/node-helpers" />
            </div>

            <p>A subset of <b>@vbarbarosh/node-helpers</b> is also available for browser:</p>
            <div>
                <div class="rel"><copy-to-clipboard value='<script src="https://unpkg.com/@vbarbarosh/node-helpers@3.70.0/dist/browser.js?var=h">&lt;/script>"' /></div>
                <prism-html value='<script src="https://unpkg.com/@vbarbarosh/node-helpers@3.70.0/dist/browser.js?var=h">&lt;/script>' />
            </div>
            <p>⚠️ All browser functions are exposed as <strong>window.h</strong>. This could be changed by <strong>?var=new_name</strong> query parameter.</p>
        </div>
    `,
});
