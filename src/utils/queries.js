// Boolean functions only
import dayjs from 'dayjs'
import { ASSET_TYPES } from 'utils/constants/assetTypes'

export const isBelow18Years = (date) =>
    dayjs(date).add(18, 'y').isAfter(dayjs())

export const isCarousel = (x) => x.entity_type === 'carousel'
export const isNotCarousel = (x) => x.entity_type !== 'carousel'

// CTA Types
export const isClickCTA = (cta) => cta?.cta_type === 'click'
export const isNotClickCTA = (cta) => cta?.cta_type !== 'click'
export const isWatchlistCTA = (cta) => cta?.cta_type === 'watchlist'
export const isRateCTA = (cta) => cta?.cta_type === 'rate'
export const isInfoCTA = (cta) => cta?.cta_type === 'info'
export const isLinkCTA = (cta) => cta?.cta_type === 'link'
export const isPlayCTA = (cta) => cta?.cta_type === 'play'

// Asset Types
export const isMovie = (asset) => asset?.asset_type === ASSET_TYPES.MOVIES
export const isShows = (asset) => asset?.asset_type === ASSET_TYPES.SHOWS
export const isMusic = (asset) => asset?.asset_type === ASSET_TYPES.MUSIC

// Asset Sub Types
export const isOriginal = (asset) => asset?.asset_sub_type === 'originals'

// Content Types
export const isEpisode = (content) => content?.content_type === 'episode'
export const isTrailer = (content) => content?.content_type === 'trailer'
export const isFullLength = (content) => content?.content_type === 'full_length'
export const isMusicAudio = (content) => content?.content_type === 'music_audio'
export const isNotTrailer = (content) => content?.content_type !== 'trailer'
export const isMusicVideo = (content) => content.content_type === 'music_video'

// Image Types
export const isLogoUrl = (image) => image.image_type === 'logo_url'

// Roles
export const isMusicDirector = (person) => person?.role === 'Music Director'

// Misc Queries
export const isPlayable = (content) =>
    content?.play_state?.content_id ||
    content?.user_state?.content_id ||
    content?.content_id

export const isLive = (show) =>
    show?.start_time &&
    dayjs().isBetween(dayjs.unix(show?.start_time), dayjs.unix(show?.end_time))
