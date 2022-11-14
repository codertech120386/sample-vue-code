<script>
import playVideoMixin from '@/mixins/playVideoMixin.vue'
import rateMixin from '@/mixins/rateMixin.vue'
import shareMixin from '@/mixins/shareMixin.vue'
import watchlistMixin from '@/mixins/watchlistMixin.vue'
import ErosPage from 'pages/ErosPage.vue'
import contentVideoModule from 'store/modules/contentVideoModule'
import {
    getPageMeta,
    structuredBreadcrumbList,
    structuredVideoObject,
} from 'utils/metaUtils'
import registerStoreModule from 'utils/registerStoreModule'
import { ErosPath } from 'utils/erosPath'
import { AVODCountries } from 'utils/constants'
import { mapActions, mapGetters, mapState } from 'vuex'
import { isMusicVideo } from 'utils/queries'
import { watchMusicVideoClickedEvent } from 'pages/ContentVideoPage/tracker'

const CONTENT_VIDEO_MODULE = 'contentVideoModule'
export default {
    extends: ErosPage,
    mixins: [shareMixin, rateMixin, watchlistMixin, playVideoMixin],
    data() {
        return {
            showRateModal: false,
            intersectionOptions: {
                root: null,
                rootMargin: '0px 0px 0px 0px',
                threshold: 1,
            },
        }
    },
    computed: {
        assetId() {
            return this.$route.params.assetId
        },
        showPremiumText() {
            const svodEntitlement = this.entityEntitlements.find(
                (element) =>
                    element.group === 'svod' &&
                    element.entitlement === 'Eros Now Premium',
            )
            return (
                this.activeUserPlan !== 'premium' &&
                svodEntitlement &&
                AVODCountries.includes(this.countryCode)
            )
        },
        ...mapGetters(CONTENT_VIDEO_MODULE, {
            isDolbyAudio: 'isDolbyAudio',
            actionList: 'actionList',
            progressPercent: 'progressPercent',
            primaryContent: 'primaryContent',
            isWatchlisted: 'isWatchlisted',
            playState: 'playState',
            ratings: 'ratings',
            userRating: 'userRating',
        }),
        ...mapState(CONTENT_VIDEO_MODULE, {
            videoData: 'videoData',
            entityEntitlements: 'entityEntitlements',
            musicVideoList: 'musicVideoList',
            recommendedContents: 'recommendedContents',
        }),
    },
    watch: {
        '$global.isLoggedIn'(value) {
            this.refreshPage()
        },
    },
    beforeCreate() {
        registerStoreModule({
            module: contentVideoModule(),
            moduleName: CONTENT_VIDEO_MODULE,
            store: this.$store,
        })
    },
    destroyed() {
        this.$store.unregisterModule(CONTENT_VIDEO_MODULE)
    },
    methods: {
        onAction(eventName, content) {
            if (typeof this[eventName] === 'function') {
                this[eventName](content)
            }
        },
        onPlay() {
            if (isMusicVideo(this.videoData)) {
                this.$tracker.trackEvent(watchMusicVideoClickedEvent.call(this))
            }
        },

        onShare() {},
        onWatchlist() {},
        onRate() {
            this.showRateModal = true
        },
        hideRatingModal() {
            this.showRateModal = false
        },
        updateRating(rating) {
            this.$$rateAsset(
                { assetId: this.assetId, rating },
                this.updateUserRating,
            )
        },
        ...mapActions(CONTENT_VIDEO_MODULE, {
            updateWatchlist: 'updateWatchlist',
            updateUserRating: 'updateUserRating',
        }),
    },
    asyncData({ store, route }) {
        registerStoreModule({
            module: contentVideoModule(),
            moduleName: CONTENT_VIDEO_MODULE,
            store,
        })
        const { contentId, assetId } = route.params
        const promises = [
            store.dispatch(CONTENT_VIDEO_MODULE + '/fetchVideoData', {
                assetId,
                contentId,
            }),
            store.dispatch(CONTENT_VIDEO_MODULE + '/fetchEntityEntitlements', {
                entityId: contentId,
                entityType: 'content',
            }),
            store.dispatch(
                CONTENT_VIDEO_MODULE + '/fetchAssetPlayState',
                assetId,
            ),
            store.dispatch(CONTENT_VIDEO_MODULE + '/fetchRecommendedContents', {
                assetId,
                contentId,
            }),
        ]
        return Promise.all(promises)
    },
    metaInfo() {
        const erosPath = new ErosPath(this.$route.path)
        const breadcrumbs = erosPath.makeBreadcrumbs(
            '',
            this.videoData.asset_title,
            this.videoData.content_title,
        )
        const meta = {
            title: this.videoData.content_title,
            description: '',
            bodyClass: 'asset-video-page',
            structuredData: [
                structuredVideoObject(this.videoData),
                structuredBreadcrumbList(breadcrumbs),
            ],
        }
        return getPageMeta(meta)
    },
}
</script>
