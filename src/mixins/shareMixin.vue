<script>
import { ErosNowUrl } from 'utils/constants'

export default {
    props: {},
    data() {
        return {}
    },
    computed: {},
    watch: {},
    methods: {
        $$share(data) {
            let { url, title = '' } = data
            if (!url) {
                return
            }
            url = ErosNowUrl + url
            if (this.$userAgent.isMobile && navigator.share) {
                navigator.share({ url, title })
            } else {
                this.$store.dispatch('$modalModule/showShareModal', {
                    url,
                    title,
                })
            }
        },
    },
}
</script>
