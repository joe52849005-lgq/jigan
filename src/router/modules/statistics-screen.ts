import { RouteConfig } from "vue-router";

const statisticsScreenRouter: RouteConfig = {
  path: "/statistics-screen",
  name: "StatisticsScreen",
  component: () =>
    import(
      /* webpackChunkName: "statistics-screen" */ "@/views/statistics-screen/index.vue"
    ),
  meta: {
    title: "秸秆禁烧区域监控大屏",
    icon: "chart"
  }
};

export default statisticsScreenRouter;
