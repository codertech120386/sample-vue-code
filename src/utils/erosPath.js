import capitalize from 'lodash/capitalize'
import { ErosNowUrl } from 'utils/constants'

export class ErosPath {
    constructor(path) {
        if (!path) return
        this._path = path
        if (!path.startsWith('/')) return
        this._parts = path.split('/') || []
    }

    makeBreadcrumbs(pageTitle, assetTitle, contentTitle) {
        return [
            this.page && {
                title: pageTitle || this.page.title,
                path: this.page.path,
            },
            this.asset && {
                title: assetTitle || this.asset.title,
                path: this.asset.path,
            },
            this.content && {
                title: contentTitle || this.content.title,
                path: this.content.path,
            },
        ].filter(Boolean)
    }

    splitParts(n) {
        if (!Array.isArray(this._parts)) return []
        const str = this._parts[n]
        if (n === 1) return [str]
        const index = str.lastIndexOf('-')
        if (index === -1) return [str]
        const slug = str.substring(0, index)
        const id = parseInt(str.substring(index + 1))
        return [slug, id]
    }

    parsed(n) {
        if (!this._parts?.[n]) return null
        const [slug, id] = this.splitParts(n)
        const path = this._parts.slice(0, n + 1).join('/')
        const title =
            n === 1
                ? capitalize(slug) || 'Home'
                : capitalize(slug?.split('-').join(' '))
        return { slug, id, title, path, url: ErosNowUrl + path }
    }

    hasId(entityType, entityId) {
        return this[entityType]?.id === entityId
    }

    get page() {
        return this.parsed(1)
    }

    get asset() {
        return this.parsed(2)
    }

    get content() {
        return this.parsed(3)
    }
}
