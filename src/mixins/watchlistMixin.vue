<script>
import { mapActions, mapState } from 'vuex'

const ASSET_WATCHLIST_MODULE = '$assetWatchlistModule'
export default {
    computed: {
        ...mapState(ASSET_WATCHLIST_MODULE, {
            pendingWatchlistData: 'pendingWatchlistData',
        }),
    },
    watch: {
        '$global.isLoggedIn'(value) {
            if (value && this.pendingWatchlistData) {
                this.$$watchlistAsset(this.pendingWatchlistData)
            }
        },
    },

    methods: {
        /**
         * isWatchlisted flag is required: default is false
         * @param payload = { entityId, entityType, isWatchlisted }
         * @param updateWatchlist = callback function
         * @returns {Promise<*>}
         */
        async $$watchlistAsset(payload, updateWatchlist) {
            let { entityId, entityType, isWatchlisted } = payload
            try {
                if (!this.$global.isLoggedIn) {
                    this._$watchlistMixin_addToPendingWatchlist(payload)
                    this.$showLoginModal()
                    return
                }
                if (!entityId) {
                    entityId = payload?.content_id || payload?.asset_id
                }
                if (!entityType) {
                    entityType = payload?.content_id ? 'content' : 'asset'
                }
                this.$showSnackBar({
                    message: isWatchlisted ? 'Removing' : 'Adding',
                    time: 1000,
                    type: 'info',
                })
                const response = isWatchlisted
                    ? await this._$watchlistMixin_removeWatchlist({
                          entityId,
                          entityType,
                      })
                    : await this._$watchlistMixin_addWatchlist({
                          entityId,
                          entityType,
                      })
                this.$showSnackBar({
                    message: isWatchlisted
                        ? 'Removed from watchlist'
                        : 'Added to watchlist',
                    time: 1000,
                    type: 'success',
                })
                updateWatchlist({ entityId, entityType, isWatchlisted })
                return response
            } catch (e) {
                this.$showSnackBar({
                    message: 'Internal Server Error',
                    type: 'error',
                    time: 1500,
                })
            }
        },
        ...mapActions(ASSET_WATCHLIST_MODULE, {
            _$watchlistMixin_removeWatchlist: 'removeWatchlist',
            _$watchlistMixin_addWatchlist: 'addWatchlist',
            _$watchlistMixin_addToPendingWatchlist: 'addToPendingWatchlist',
        }),
    },
}
</script>
