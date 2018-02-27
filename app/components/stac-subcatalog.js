import Component from '@ember/component';

export default Component.extend({
    classNames: ['stac-subcatalog', 'text-group'],

    actions: {
        viewCatalog() {
            this.get('onSelect')(this.item);
        }
    }
});
