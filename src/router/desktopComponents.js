export const ContentVideoPage = () =>
  import(
    "pages/ContentVideoPage/Desktop"
    /* webpackChunkName: "desktop-content-video-page" */
  ).then((m) => m.default);
