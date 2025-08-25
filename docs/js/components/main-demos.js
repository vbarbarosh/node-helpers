vue_component('main-demos', {
    props: ['items', 'items_hit'],
    template: `
        <section v-for="item in items" v-bind:key="item.file" v-show="items_hit.has(item)">
            <h2 :id="item.id">{{ item.file }}</h2>
            <div>
                <div class="rel"><copy-to-clipboard :value="item.contents" /></div>
                <markdown v-if="item.file.endsWith('.md')" :value="item.contents" />
                <prism-js v-else-if="item.file.endsWith('.js')" :value="item.contents" />
                <prism-php v-else-if="item.file.endsWith('.php')" :value="item.contents" />
                <prism-bash v-else-if="item.file.endsWith('.sh')" :value="item.contents" />
                <prism-js v-else-if="item.contents.startsWith('#!/usr/bin/env node')" :value="item.contents"></prism-js>
                <pre v-else>{{ item.contents }}</pre>
            </div>
        </section>
    `,
});
