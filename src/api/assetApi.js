import queryString from 'query-string'
export async function fetchAssetDataLarge($apiClient, assetId) {
    const url = `/api/v1/core/assets/l/${assetId}`
    const response = await $apiClient.get(url)
    return response.data
}
export async function fetchAssetDataMedium($apiClient, assetId) {
    const url = `/api/v1/core/assets/m/${assetId}`
    const response = await $apiClient.get(url)
    return response.data
}
export async function fetchAssetPlayState($apiClient, assetId) {
    const url = `/api/v1/core/assets/${assetId}/user_playstate`
    const response = await $apiClient.get(url)
    return response.data
}

export async function fetchAssetContentList(
    $apiClient,
    {
        assetId,
        excludeContentTypeIds,
        contentTypeIds,
        sortBy,
        sortMode,
        limit,
        offset,
    },
) {
    let params = {
        exclude_content_type_ids: excludeContentTypeIds,
        content_type_ids: contentTypeIds,
        sort_by: sortBy,
        sort_mode: sortMode,
        limit: limit,
        offset: offset,
    }
    params = queryString.stringify(params, { arrayFormat: 'comma' })
    const url = `/api/v1/core/assets/${assetId}/contents?${params}`
    const response = await $apiClient.get(url)
    return response.data
}

export async function fetchContentDetail($apiClient, { assetId, contentId }) {
    const url = `/api/v1/core/assets/${assetId}/contents/${contentId}`
    const response = await $apiClient.get(url)
    return response.data
}
