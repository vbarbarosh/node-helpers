vue_component('download-zip', {
    props: ['files', 'saveAs'],
    template: `
        <button v-on:click="click">🗜️ Download .zip</button>  
    `,
    methods: {
        click: async function () {
            const zip = new JSZip();
            this.files.forEach(file => zip.file(file.name, file.body));
            const blob = await blocking(zip.generateAsync({type: 'blob'}));
            saveAs(blob, this.saveAs ?? 'demo.zip');
        },
    },
});
