import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
    classNames: ['stac-item'],
    thumbnailSrc: computed('item.links', function() {
        if (this.item.links) {
            const thumbnail = this.item.links.find(l => l.rel.toLowerCase() === 'thumbnail');
            if (thumbnail) {
                return thumbnail.href;
            }
        }
        return false;
    }),
    thumbnailStyle: computed('thumbnailSrc', function() {
        if (this.thumbnailSrc) {
            return htmlSafe(`background-image: url(${this.thumbnailSrc})`);
        }
        return htmlSafe('');
    })
});
