vue_component('main-demos', {
    props: ['items', 'items_hit'],
    template: `
        <section v-for="demo in demos" v-bind:key="demo.key" v-show="show(demo)">
            <h2 :id="demo.anchor" class="flex-row-center white sticky-t" style="top:-40px;">
                {{ demo.label }}
                <span class="ma" />
                <download-zip :files="demo.files_download" />
            </h2>
            <files-browser :files="demo.files_browse" />
        </section>
    `,
    computed: {
        demos: function () {
            const package_json = `{
  "dependencies": {
    "@vbarbarosh/node-helpers": "^3.72.0"
  }
}`;
            const tmp = {};
            this.items.forEach(function (item) {
                const [, dir_name, ...etc] = item.file.split('/');
                const file = {name: etc.join('/'), body: item.contents};
                tmp[dir_name] ??= {
                    key: dir_name,
                    anchor: dir_name,
                    label: `demos • ${dir_name}`,
                    items: [],
                    files_browse: [],
                    files_download: [
                        {name: 'package.json', body: package_json},
                    ],
                };
                tmp[dir_name].items.push(item);
                tmp[dir_name].files_browse.push(file);
                tmp[dir_name].files_download.push(file);
            });
            return Vue.reactive(Object.values(tmp).sort(h.fcmpx('label')));
        },
    },
    methods: {
        show: function (demo) {
            return demo.items.some(v => this.items_hit.has(v));
        },
    },
});
