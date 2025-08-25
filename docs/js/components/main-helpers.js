vue_component('main-helpers', {
    props: ['items', 'items_hit'],
    template: `
        <section v-for="item in items" v-bind:key="item.file" v-show="items_hit.has(item)">
            <h2 :id="item.id">{{ item.name }}</h2>
            <tabs-underline>
                <tabs-item label="Description">
                    <div class="rel"><copy-to-clipboard :value="item.require" /></div>
                    <prism-js :value="item.require" />
                </tabs-item>
                <tabs-item label="Demos">
                    <lipsum />
                </tabs-item>
                <tabs-item label="Source">
                    <div class="rel"><copy-to-clipboard :value="item.source_code" /></div>
                    <prism-js :value="item.source_code" />
                </tabs-item>
            </tabs-underline>
        </section>
    `,
});
