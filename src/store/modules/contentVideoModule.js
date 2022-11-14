import {
    fetchContentDetail,
    fetchAssetPlayState,
    fetchAssetContentList,
} from 'api/assetApi'
import { fetchRecommendedContents } from 'api/recommendationsApi'
import { fetchEntityEntitlements } from 'api/entityEntitlementsApi'
import {
    isTrailer,
    isNotTrailer,
    isWatchlistCTA,
    isRateCTA,
} from 'utils/queries'
import { CONTENT_TYPE_IDS } from 'utils/constants'
import Vue from 'vue'

export default () => {
    // initial state
    const initialState = () => ({
        videoData: {},
        entityEntitlements: null,
        recommendedContents: [],
        musicVideoList: [],
    })
    const state = initialState()

    // getters
    const getters = {
        playState(state) {
            const { user_state: userState, ...videoData } =
                state.videoData || {}
            return state.videoData
                ? [{ ...videoData, ...userState, button_text: 'Watch Now' }]
                : []
        },
        labels(state) {
            return state.videoData?.labels || []
        },
        isDolbyAudio(state, getters) {
            return getters.labels?.includes('Dolby')
        },
        primaryContent(state, getters) {
            if (isTrailer(state.videoData)) {
                return getters.playState[0]
            } else {
                return getters.playState?.find(isNotTrailer)
            }
        },
        progressPercent(state, getters) {
            return getters.playState[0]?.progress_percent || 0
        },
        actionList(state, getters) {
            return getters.primaryContent?.ctas || []
        },
        isWatchlisted(state, getters) {
            return getters.primaryContent?.is_watchlisted
        },
        userRating(state) {
            return state.playStateData?.user_rating
        },
        ratings(state) {
            return state.videoData?.ratings || {}
        },
    }

    // actions
    const actions = {
        async updateWatchlist({ commit }, value) {
            commit('UPDATE_WATCHLIST', value)
        },
        async updateUserRating({ commit }, value) {
            commit('UPDATE_USER_RATING', value)
        },
        async fetchVideoData({ commit }, { assetId, contentId }) {
            const payload = await fetchContentDetail(this.$apiClient, {
                assetId,
                contentId,
            })
            if (payload?.status === 'success') {
                commit('SET_VIDEO_DATA', payload?.data)
                if (payload?.data.content_type === 'music_video') {
                    const videoListPayload = await fetchAssetContentList(
                        this.$apiClient,
                        {
                            assetId: payload?.data.asset_id,
                            contentTypeIds: CONTENT_TYPE_IDS.musicVideo,
                            limit: 10,
                        },
                    )
                    const { items } = videoListPayload?.data || {}
                    const excludedItems = items.filter((item) => {
                        return item.content_id !== +contentId
                    })
                    if (videoListPayload?.status === 'success') {
                        commit('SET_MUSIC_VIDEO_LIST', excludedItems || [])
                    }
                    return videoListPayload
                } else {
                    return payload
                }
            } else {
                return payload
            }
        },
        async fetchEntityEntitlements({ commit }, { entityId, entityType }) {
            const payload = await fetchEntityEntitlements(this.$apiClient, {
                entityType,
                entityId,
            })
            if (payload?.status === 'success') {
                commit('SET_ENTITY_ENTITLEMENTS', payload?.data)
            }
            return payload
        },
        async fetchAssetPlayState({ commit }, assetId) {
            const payload = await fetchAssetPlayState(this.$apiClient, assetId)
            if (payload?.status === 'success') {
                commit('SET_PLAY_STATE_LIST', payload?.data)
            }
            return payload
        },
        async fetchRecommendedContents({ commit }, { assetId, contentId }) {
            const payload = await fetchRecommendedContents(this.$apiClient, {
                assetId,
                contentId,
            })
            if (payload?.status === 'success') {
                commit('SET_RECOMMENDED_CONTENTS', payload?.data)
            }
            return payload
        },
        resetState({ commit }) {
            commit('RESET_STATE')
        },
    }

    // mutations
    const mutations = {
        UPDATE_WATCHLIST(state, payload) {
            Vue.set(state.videoData, 'is_watchlisted', payload)
            if (state.videoData?.ctas?.length > 0) {
                const wlCta = state.videoData?.ctas?.find(isWatchlistCTA)
                wlCta.cta_selected_state = payload
                Vue.set(state.videoData, 'ctas', [...state.videoData.ctas])
            }
        },
        UPDATE_USER_RATING(state, payload) {
            Vue.set(state.videoData, 'user_rating', payload)
            const ctaList = state.videoData?.ctas || []
            if (ctaList.length > 0) {
                const rateCta = ctaList.find(isRateCTA)
                if (rateCta) rateCta.cta_selected_state = true
                Vue.set(state.videoData, 'ctas', [...ctaList])
            }
        },
        SET_VIDEO_DATA(state, payload) {
            state.videoData = payload
        },
        SET_ENTITY_ENTITLEMENTS(state, payload) {
            state.entityEntitlements = payload
        },
        SET_MUSIC_VIDEO_LIST(state, payload) {
            state.musicVideoList = payload
        },
        SET_PLAY_STATE_LIST(state, payload) {
            state.playStateList = payload
        },
        SET_RECOMMENDED_CONTENTS(state, paylaod) {
            state.recommendedContents = paylaod
        },
        RESET_STATE(state) {
            const initState = initialState()
            Object.keys(initState).forEach((key) => {
                state[key] = initState[key]
            })
        },
    }
    return {
        namespaced: true,
        state,
        getters,
        actions,
        mutations,
    }
}
