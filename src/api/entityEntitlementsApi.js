export async function fetchEntityEntitlements(
    $apiClient,
    { entityType, entityId },
) {
    const url = `/api/v2/catalog/entitlement/${entityType}/${entityId}`

    const response = await $apiClient.get(url)
    return response.data
}
