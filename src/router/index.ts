import Vue from "vue";
import Router, { RouteConfig } from "vue-router";
import BaiduMap from "vue-baidu-map";

/* Layout */
import Layout from "@/layout/index.vue";

/* Router modules */
import componentsRouter from "./modules/components";
import tableRouter from "./modules/table";
import nestedRouter from "./modules/nested";

Vue.use(Router);

Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: "cvvLcnEHuM6OMGZUGq7TznPH2thfTUF3"
});
/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () =>
          import(
            /* webpackChunkName: "redirect" */ "@/views/redirect/index.vue"
          )
      }
    ]
  },
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
    meta: { hidden: true }
  },
  {
    path: "/auth-redirect",
    component: () =>
      import(
        /* webpackChunkName: "auth-redirect" */ "@/views/login/auth-redirect.vue"
      ),
    meta: { hidden: true }
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/error-page/404.vue"),
    meta: { hidden: true }
  },
  {
    path: "/401",
    component: () =>
      import(/* webpackChunkName: "401" */ "@/views/error-page/401.vue"),
    meta: { hidden: true }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "dashboard" */ "@/views/login/index.vue"),
        name: "login",
        meta: {
          title: "login",
          icon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
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
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: "/permission",
    component: Layout,
    redirect: "/permission/directive",
    meta: {
      title: "permission",
      icon: "lock",
      roles: ["admin", "editor"], // you can set roles in root nav
      alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: "page",
        component: () =>
          import(
            /* webpackChunkName: "permission-page" */ "@/views/permission/page.vue"
          ),
        name: "PagePermission",
        meta: {
          title: "pagePermission",
          roles: ["admin"] // or you can only set roles in sub nav
        }
      },
      {
        path: "role",
        component: () =>
          import(
            /* webpackChunkName: "permission-role" */ "@/views/permission/role.vue"
          ),
        name: "RolePermission",
        meta: {
          title: "rolePermission",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/icon",
    component: Layout,
    children: [
      {
        path: "index",
        component: () =>
          import(/* webpackChunkName: "icons" */ "@/views/icons/index.vue"),
        name: "Icons",
        meta: {
          title: "icons",
          icon: "icon",
          noCache: true
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  nestedRouter,
  tableRouter,
  {
    path: "/  ",
    component: Layout,
    children: [
      {
        path: "index",
        component: () =>
          import(/* webpackChunkName: "tab" */ "@/views/tab/index.vue"),
        name: "Tab",
        meta: {
          title: "tab",
          icon: "tab"
        }
      }
    ]
  },
  {
    path: "/error",
    component: Layout,
    redirect: "noredirect",
    meta: {
      title: "errorPages",
      icon: "404"
    },
    children: [
      {
        path: "401",
        component: () =>
          import(
            /* webpackChunkName: "error-page-401" */ "@/views/error-page/401.vue"
          ),
        name: "Page401",
        meta: {
          title: "page401",
          noCache: true
        }
      },
      {
        path: "404",
        component: () =>
          import(
            /* webpackChunkName: "error-page-404" */ "@/views/error-page/404.vue"
          ),
        name: "Page404",
        meta: {
          title: "page404",
          noCache: true
        }
      }
    ]
  },
  {
    path: "/error-log",
    component: Layout,
    redirect: "noredirect",
    children: [
      {
        path: "log",
        component: () =>
          import(
            /* webpackChunkName: "error-log" */ "@/views/error-log/index.vue"
          ),
        name: "ErrorLog",
        meta: {
          title: "errorLog",
          icon: "bug"
        }
      }
    ]
  },
  {
    path: "*",
    redirect: "/404",
    meta: { hidden: true }
  }
];

const createRouter = () =>
  new Router({
    // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    base: process.env.BASE_URL,
    routes: [...constantRoutes, ...asyncRoutes]
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
