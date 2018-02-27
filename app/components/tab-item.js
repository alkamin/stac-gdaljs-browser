import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    tagName: 'a',
    classNames: ['tab'],
    classNameBindings: ['isActive'],

    tag: null,
    activeTag: null,

    isActive: computed('tag', 'activeTag', function() {
        return this.tag === this.activeTag;
    }),

    click() {
        this.get('onClick')(this.tag);
    }
});
