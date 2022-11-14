export async function fetchRecommendedContents(
    $apiClient,
    { assetId, contentId },
) {
    const url = `/api/v1/core/assets/${assetId}/recommended_contents`
    const response = await $apiClient.get(url)
    return response.data
}

export async function fetchRecommendedAssets($apiClient, assetId) {
    const url = `/api/v1/core/assets/${assetId}/recommendation`
    const response = await $apiClient.get(url)
    return response.data
}
