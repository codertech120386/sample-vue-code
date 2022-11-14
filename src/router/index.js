import Vue from "vue";
import Meta from "vue-meta";
import Router from "vue-router";

if (!Vue.routerRegistered) {
  Vue.use(Router);
  Vue.routerRegistered = true;
}
if (!Vue.vueMetaRegistered) {
  Vue.use(Meta);
  Vue.vueMetaRegistered = true;
}

export function createRouter(components, context = {}) {
  const routes = [
    {
      path: "/:assetType(\\w+-)?:assetSubType?/:assetSlug-:assetId(\\d+)/:contentSlug-:contentId(\\d+)",
      component: components.ContentVideoPage,
      name: "ContentVideoPage",
      meta: {
        weScreenName: "ContentVideoPage",
        screenName: "content_video_screen",
        showBackBtn: true,
      },
    },
  ];

  if (!_SERVER_) {
    routes.push({
      path: "*",
      component: components.NotFoundPage,
      name: "notFoundPage",
      meta: {
        weScreenName: "NotFoundPage",
        screenName: "not_found_page",
        showBottomNav: true,
        // showTopNav: true,
        showBackBtn: true,
      },
    });
  }
  return new Router({
    mode: "history",
    fallback: false,
    scrollBehavior() {
      return window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    routes,
  });
}
