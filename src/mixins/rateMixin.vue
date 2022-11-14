<script>
import { mapActions, mapState } from 'vuex'
import { SERVER_ERROR_CODE } from 'utils/constants'

const ASSET_RATING_MODULE = '$assetRatingModule'
export default {
    computed: {
        ...mapState(ASSET_RATING_MODULE, {
            pendingRateData: 'pendingRateData',
        }),
    },
    watch: {
        '$global.isLoggedIn'(value) {
            if (value && this.pendingRateData) {
                this.$$rateAsset(this.pendingRateData)
            }
        },
    },

    methods: {
        async $$rateAsset({ assetId, rating }, updateRating) {
            try {
                if (!this.$global.isLoggedIn) {
                    this._$watchlistMixin_addToPendingWatchlist({
                        assetId,
                        rating,
                    })
                    this.$showLoginModal()
                } else {
                    if (!rating || typeof +rating !== 'number') {
                        return this.$showSnackBar({
                            message: 'Invalid rating',
                            type: 'error',
                            time: 1500,
                            isClosable: true,
                        })
                    }
                    this.$showSnackBar({
                        message: 'Please wait',
                        time: 1000,
                        type: 'info',
                    })
                    const response = await this._$rateMixin_rateAsset({
                        assetId,
                        rating: +rating,
                    })
                    this.$showSnackBar({
                        message: 'Successfully Rated',
                        time: 1000,
                        type: 'success',
                    })
                    updateRating(rating)
                    return response
                }
            } catch (e) {
                if (
                    e.payload &&
                    e.payload.data &&
                    e.payload.data.error_code ===
                        SERVER_ERROR_CODE.INVALID_INPUT
                ) {
                    this.$showSnackBar({
                        message: e.payload.data.message || 'Already Rated',
                        type: 'error',
                        time: 1500,
                        isClosable: true,
                    })
                } else {
                    this.$showSnackBar({
                        message: 'Internal Server Error',
                        type: 'error',
                        time: 1500,
                        isClosable: true,
                    })
                }
            }
        },
        ...mapActions(ASSET_RATING_MODULE, {
            _$rateMixin_rateAsset: 'rateAsset',
            _$rateMixin_addToPendingRate: 'addToPendingRate',
        }),
    },
}
</script>
