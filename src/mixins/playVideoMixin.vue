<script>
import { mapActions } from 'vuex'

export default {
    methods: {
        async $$playVideo(payload) {
            if (!payload.contentId || payload.contentId === '0') {
                return
            }
            this.openVideoPlayer({
                ...payload,
                playerTitle: payload.title,
            })
        },
        ...mapActions({
            openVideoPlayer: '$appModule/openVideoPlayer',
        }),
    },
}
</script>
