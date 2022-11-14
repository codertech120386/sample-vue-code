export const ContentVideoPage = () =>
  import(
    "pages/ContentVideoPage/Mobile"
    /* webpackChunkName: "mobile-content-video-page" */
  ).then((m) => m.default);
