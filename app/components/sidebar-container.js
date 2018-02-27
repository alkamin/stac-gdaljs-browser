import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    catalogService: inject('catalog'),
    uiStateService: inject('uiState'),
    classNames: ['sidebar'],
    catalogUrl: null,

    didReceiveAttrs() {
        this._super(...arguments);
        this.fetchCatalog();
    },

    fetchCatalog() {
        if (this.catalogUrl) {
            this.catalogService.fetchCatalog(this.catalogUrl).then(() => this.resetTabs());
        }
    },

    setCatalog(catalogJson) {
        this.catalogService.setCatalog(catalogJson).then(() => this.resetTabs());
    },

    resetTabs() {
        this.uiStateService.set('activeList', 'info');
    },

    actions: {
        fetchCatalog (url) {
            this.set('catalogUrl', url);
            this.fetchCatalog();
        },
        setCatalog(catalog) {
            this.setCatalog(catalog);
        },
        toggleList(list) {
            this.uiStateService.set('activeList', list);
        }
    }
});
