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
        </LazyImage>
        <!-- todo: replace with image here for dolby-->
        <i
          v-if="isDolbyAudio"
          class="asset-video__banner--dolby-icon icon icon-dolby"
        ></i>
        <div class="asset-video__banner--gradient"></div>
        <div class="asset-video__banner--detail">
          <h1 class="asset-video__banner--heading resp-content">
            {{ videoData.content_title }}
          </h1>
          <DesktopPremiumBadge v-if="showPremiumText" class="resp-content" />
          <DesktopAssetActionBar
            class="asset-video__banner--action-bar"
            :action-list="actionList"
            :play-state-list="playState"
            :progress-percent="progressPercent"
            :is-watchlisted="isWatchlisted"
            :asset-data="videoData"
            @onAction="onAction"
          />
        </div>
      </div>
      <DesktopCarouselPlaylist
        v-if="musicVideoList.length"
        :playlist-data="musicVideoList"
        :playlist-title="'More From This Album'"
        :card="{ tile: 'HTile' }"
      />
      <DesktopCarouselPlaylist
        v-if="recommendedContents && recommendedContents.length"
        :playlist-data="recommendedContents"
        :playlist-title="'You May Also Like'"
        :card="{ tile: 'HTile' }"
      />
      <DesktopRatingModal
        v-if="showRateModal"
        :hide-modal-handler="hideRatingModal"
        :rating-text="'Like the content? Tell us'"
        @updateRating="updateRating"
      />
    </div>
  </div>
</template>

<script>
import { IMAGE_TYPE } from "utils/constants/imageTypes";
import ContentVideoPage from "../ContentVideoPage/ContentVideoPage.vue";
import DesktopAssetActionBar from "components/AssetActionBar/Desktop";
import DesktopCarouselPlaylist from "components/CarouselPlaylist/Desktop";
import DesktopPremiumBadge from "components/PremiumBadge/Desktop";
import LazyImage from "components/LazyImage";
import { getImageData } from "utils/imageUtils";
import DesktopRatingModal from "components/ErosModals/RatingModal/Desktop";

export default {
  name: "DesktopContentVideoPage",
  components: {
    DesktopAssetActionBar,
    DesktopCarouselPlaylist,
    DesktopPremiumBadge,
    LazyImage,
    DesktopRatingModal,
  },
  extends: ContentVideoPage,
  props: {
    contentPopupData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    bannerImage() {
      return getImageData({
        images: this.videoData?.images,
        imageType: IMAGE_TYPE.HORIZONTAL_POSTER_WITH_TITLE, // TODO: replace with without title IMAGE_TYPE.HORIZONTAL_POSTER_WITHOUT_TITLE,
        imageVariant: "M",
      });
    },
  },
  methods: {
    hideBottomSheet() {
      if (typeof this.hideBottomSheetHandler === "function") {
        this.hideBottomSheetHandler();
      }
    },
  },
};
</script>

<style lang="scss">
@use "ContentVideoPage";
</style>
