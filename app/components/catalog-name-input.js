import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { run } from '@ember/runloop';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

export default Component.extend(FocusableComponent, {
    focusNode: 'input',
    classNames: ['catalog-name-input'],

    catalogService: inject('catalog'),

    isShowingInput: true,
    catalogUrl: null,

    isShowingName: computed('catalogService.currentCatalog', 'isShowingInput', function() {
        return this.catalogService.currentCatalog && !this.isShowingInput;
    }),

    didReceiveAttrs() {
        this._super(...arguments);
        if (this.catalogUrl) {
            this.set('isShowingInput', false);
        }
    },

    didRender() {
        this._super(...arguments);
        if(this.isShowingInput) {
            this.focus();
        }
    },

    actions: {
        fetchCatalog() {
            this.get('onChange')(this.catalogUrl);
            this.set('isShowingInput', false);
        },

        toggleShowingInput() {
            this.toggleProperty('isShowingInput');
            if (this.isShowingInput) {
                this.focusAfterRender();
            }
        }
    }
});
