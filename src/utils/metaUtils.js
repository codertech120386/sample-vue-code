<script>
import { mapActions, mapGetters, mapState } from 'vuex'

/**
 * this file contains the most common functionality
 * that every page should extend
 *
 *
 */
export default {
    data() {
        return {}
    },
    computed: {
        ...mapState({
            userData: (state) => state.$authModule.userData,
        }),
        ...mapGetters('$authModule', {
            activeUserPlan: 'activeUserPlan',
        }),
        ...mapGetters({
            countryCode: '$appModule/countryCode',
        }),
    },
    methods: {
        async refreshPage() {
            // this.$showAppLoader()
            await this.$options.asyncData({
                store: this.$store,
                route: this.$route,
                context: { ...this.$global, userAgent: this.$userAgent },
            })
            // this.$hideAppLoader()
        },
        // add methods here which is needed on almost every page
        ...mapActions({
            showSubscriptionModal: '$modalModule/showSubscriptionModal',
        }),
    },
}
</script>
