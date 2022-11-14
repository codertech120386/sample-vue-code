export function watchMusicVideoClickedEvent() {
    return {
        category: '',
        action: 'watch_music_video_clicked',
        label: {
            asset_id: this.asset_id,
            asset_name: this.asset_title,
            content_id: this.content_id,
            content_name: this.content_title,
            asset_type: this.assetType,
            tile_position: '',
        },
    }
}
