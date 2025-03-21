declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "element-ui/lib/locale/lang/*" {
  export const elementLocale: any;
}

declare module "*.gif" {
  export const gif: any;
}

// TODO: remove this part after vue-count-to has its typescript file
declare module "vue-count-to";
declare module "mockjs";
// TODO: remove this part after vuedraggable has its typescript file
declare module "vuedraggable";

// TODO: remove this part after vue2-dropzone has its typescript file
declare module "vue2-dropzone";

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module "vue-image-crop-upload";

declare module "vue-seamless-scroll";
//百度地图
declare const BMapGL: any;
declare const BMapLib: any;
declare const BMap: any;
declare const BMAP_NAVIGATION_CONTROL_LARGE: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;
declare const BMAP_ANCHOR_BOTTOM_RIGHT: any;
declare const BMAP_POINT_SIZE_SMALL: any;
