<template>
    <div class="asset-video">
        <div v-if="videoData" class="asset-video--container">
            <div class="asset-video__banner--container">
                <LazyImage
                    class="asset-video__banner--image"
                    :data-src="bannerImage.path"
                    :alt="bannerImage.altText"
                    :display-type="'bgImage'"
                    :lazyload-image="true"
                >
                    <div
                        class="asset-video__banner--play-button"
                        @click="onPlay(primaryContent)"
                    >
                        <i
                            class="
                                icon icon-play
                                asset-video__banner--play-button-icon
                            "
                        ></i>
                    </div>
                </LazyImage>
                <div class="asset-video__banner--detail resp-content">
                    <h1 class="asset-video__banner--heading">
                        {{ videoData.content_title }}
                    </h1>
                    <h4 class="asset-video__banner--sub-heading">
                        {{ videoData.asset_title }}
                    </h4>
                    <MobilePremiumBadge v-if="showPremiumText" />
                    <MobileAssetActionBar
                        class="asset-video__banner--action-bar"
                        :action-list="actionList"
                        :play-state-list="playState"
                        :progress-percent="progressPercent"
                        :asset-data="videoData"
                        @onAction="onAction"
                    />
                </div>
            </div>
            <NativeMobileCarouselPlaylist
                v-if="musicVideoList.length"
                :playlist-data="musicVideoList"
                :playlist-title="'More From This Album'"
                :card="{ tile: 'HTile' }"
            />
            <NativeMobileCarouselPlaylist
                v-if="recommendedContents && recommendedContents.length"
                :playlist-data="recommendedContents"
                :playlist-title="'You May Aso Like'"
                :card="{ tile: 'HTile' }"
            />
            <MobileRatingModal
                v-if="showRateModal"
                :hide-modal-handler="hideRatingModal"
                :rating-text="'Like the content? Tell us'"
                @updateRating="updateRating"
            />
        </div>
    </div>
</template>

<script>
import LazyImage from 'components/LazyImage'
import ContentVideoPage from 'pages/ContentVideoPage/ContentVideoPage.vue'
import NativeMobileCarouselPlaylist from 'components/CarouselPlaylist/NativeMobile'
import MobileAssetActionBar from 'components/AssetActionBar/Mobile'
import MobileRatingModal from 'components/ErosModals/RatingModal/Mobile'
import MobilePremiumBadge from 'components/PremiumBadge/Mobile'
import { IMAGE_TYPE } from 'utils/constants/imageTypes'
import { getImageData } from 'utils/imageUtils'

export default {
    name: 'MobileContentVideoPage',
    components: {
        MobileAssetActionBar,
        LazyImage,
        NativeMobileCarouselPlaylist,
        MobileRatingModal,
        MobilePremiumBadge,
    },
    extends: ContentVideoPage,
    computed: {
        bannerImage() {
            return getImageData({
                images: this.videoData?.images,
                imageType: IMAGE_TYPE.HORIZONTAL_POSTER_WITH_TITLE, // TODO: replace with without title IMAGE_TYPE.HORIZONTAL_POSTER_WITHOUT_TITLE,
                imageVariant: 'M',
            })
        },
    },
}
</script>

<style lang="scss">
@use 'ContentVideoPage';
</style>
