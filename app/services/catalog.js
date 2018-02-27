import Service from '@ember/service';
import { all, allSettled } from 'rsvp';
import { inject } from '@ember/service';

function isRelativeUrl(url) {
    const r = new RegExp('^(?:[a-z]+:)?', 'i');
    return r.test(url);
}

function resolveRelativeUrl(src, rel) {
    let base = src;
    const lio = base.lastIndexOf('/');

    if (lio !== base.length) {
        base = base.slice(0, lio + 1);
    }
    return base + rel;
}

export default Service.extend({
    routerService: inject('router'),
    currentCatalog: false,
    currentUrl: '',
    currentItems: false,
    currentSubCatalogs: false,
    isLoading: false,

    initLoading() {
        this.set('isLoading', true);
        this.set('currentCatalog', false);
        this.set('currentItems', false);
    },

    fetchCatalog(url) {
        if (url) {
            this.initLoading();
            const toReturn = fetch(url)
                .then(d => d.json())
                .then(json => {
                    this.set('currentCatalog', json);
                    this.routerService.transitionTo('index', { queryParams: { catalog: url }});
                    return all([
                        this.fetchLinks('item', 'currentItems', url),
                        this.fetchLinks('child', 'currentSubCatalogs', url)
                    ]);
                });

            toReturn.then(() => this.set('isLoading', false));
            return toReturn;
        }
        return false;
    },

    setCatalog(catalogJson) {
        this.initLoading();
        this.set('currentCatalog', catalogJson);
        const selfLink = catalogJson.links.find(l => l.rel === 'self');
        if (selfLink) {
            const url = selfLink.href;
            const toReturn = all([
                this.fetchLinks('item', 'currentItems', url),
                this.fetchLinks('child', 'currentSubCatalogs', url)
            ]);

            toReturn.then(() => {
                this.routerService.transitionTo('index', { queryParams: { catalog: url }});
                this.set('isLoading', false)
            });

            return toReturn;
        }
        return false;
    },

    fetchLinks(type, target, baseUrl) {
        return all(
            this.currentCatalog.links.filter(l => l.rel.toLowerCase() === type).map(u => {
                const url = isRelativeUrl(u) ? resolveRelativeUrl(baseUrl, u.href) : u.href;
                return fetch(url);
            }))
            .then(linkPs => all(linkPs))
            .then(linkRs => {
                const linksJson = linkRs.map(l => l.json());
                return allSettled(linksJson);
            })
            .then(links => {
                this.set(target, links.filter(l => l.value).map(l => l.value));
            });
    }
});
