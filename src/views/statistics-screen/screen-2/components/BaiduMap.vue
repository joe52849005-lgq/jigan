<template>
  <div>
    <div id="div1" :style="style" style="position: absolute;z-index: -10;" />
    <BaiduMapRight
      v-if="BaiduMapRightVisible"
      :BaiduMapRightData="BaiduMapRightData"
      ref="BaiduMapRight"
    />
    <BaiduMapJian
      v-if="BaiduMapJianVisible"
      :BaiduMapJianData="BaiduMapJianData"
      ref="BaiduMapJian"
    />
    <BaiduMapTop
      v-if="BaiduMapTopVisible"
      :pointCount="pointCount"
      :warnCount="warnCount"
      :doneCount="doneCount"
      id="BaiduMapTop"
    />
    <div
      v-if="BaiduMapRightVisible === false && BaiduMapJianVisible === false"
      class="rightBottom"
    >
      <div
        style="padding: 5px 0"
        @click="jianMarker(regionName, searchJianList)"
      >
        全部
      </div>
      <div style="padding: 5px 0" @click="zeroClick()">
        <div
          style="background:#00e400;width:14px;height:14px;border-radius:50%; float:left;margin:2px"
        />
        <div style="padding-left: 25px;">火点=0</div>
      </div>
      <div style="padding: 5px 0" @click="fiveClick()">
        <div
          style="background:#ffff00;width:14px;height:14px;border-radius:50%; float:left;margin:2px"
        />
        <div style="padding-left: 25px;">0&lt;火点&lt;=5</div>
      </div>
      <div style="padding: 5px 0" @click="tenClick()">
        <div
          style="background:#ffb538;width:14px;height:14px;border-radius:50%; float:left;margin:2px"
        />
        <div style="padding-left: 25px;">5&lt;火点&lt;=10</div>
      </div>
      <div style="padding: 5px 0" @click="maxClick()">
        <div
          style="background:#e22547;width:14px;height:14px;border-radius:50%; float:left;margin:2px"
        />
        <div style="padding-left: 25px;">火点>10</div>
      </div>
    </div>

    <div
      v-if="fullScreenVisible"
      class="fullScreen"
      :style="{
        width: fullScreenWidth + 'px',
        height: fullScreenHeight + 30 + 'px',
        'background-size': '100% 100%',
        'background-repeat': 'no-repeat',
        'background-image': 'url(/img/img-bg01.2e383400.png)',
        position: 'absolute',
        transform: 'translate(0%, -5%)',
        left: '10%',
        top: '10%'
      }"
    >
      <div
        id="fullScreen"
        :style="{
          height: fullScreenHeight + 'px',
          width: fullScreenWidth + 'px'
        }"
      >
        <img
          class="closeUrl"
          :src="closeUrl"
          alt
          srcset
          @click="fullScreenClose()"
        />
        <video
          v-if="isLiveUrl(videoUrl)"
          class="fullScreenIframe"
          id="liveFull"
          width="100%"
          height="100%"
          controls="controls"
        />
        <!-- <embed
          v-else-if="isLiveUrl(videoUrl) && cityName === '崇左市'"
          id="liveEmbed"
          type="application/x-vlc-plugin"
          pluginspage="http://www.videola.org"
          version="VideoLAN.VLCPlugin.2"
          autoplay="yes"
          loop="no"
          :target="videoUrl"
          width="100%"
          height="100%"
        /> -->
        <iframe
          v-else
          id="show-iframe"
          class="fullScreenIframe"
          frameborder="0"
          name="showHere"
          scrolling="auto"
          :src="videoUrl"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { map } from "../map";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import axios from "axios";
import Hls from "hls.js";
const bg06 = require("../../../../assets/screen_images/img-bg06.png");
// 国控点
const icon1 = require("../../../../assets/screen_images/icon-coordinates-1.png");
const icon2 = require("../../../../assets/screen_images/icon-coordinates-2.png");
const icon3 = require("../../../../assets/screen_images/icon-coordinates-3.png");
const icon4 = require("../../../../assets/screen_images/icon-coordinates-4.png");
const icon5 = require("../../../../assets/screen_images/icon-coordinates-5.png");
const icon6 = require("../../../../assets/screen_images/icon-coordinates-6.png");

const iconb1 = require("../../../../assets/screen_images/icon-coordinates-b1.png");
const iconb2 = require("../../../../assets/screen_images/icon-coordinates-b2.png");
const iconb3 = require("../../../../assets/screen_images/icon-coordinates-b3.png");
const iconb4 = require("../../../../assets/screen_images/icon-coordinates-b4.png");
const iconb5 = require("../../../../assets/screen_images/icon-coordinates-b5.png");
const iconb6 = require("../../../../assets/screen_images/icon-coordinates-b6.png");

// 监控点
const iconWarn1 = require("../../../../assets/screen_images/icon-warning-1.png");
const iconWarn2 = require("../../../../assets/screen_images/icon-warning-2.png");
const iconWarn3 = require("../../../../assets/screen_images/icon-warning-3.png");
const iconWarn4 = require("../../../../assets/screen_images/icon-warning-4.png");
// 搜索出的监控点
const searchIcon1 = require("../../../../assets/screen_images/search-icon-1.png");
const searchIcon2 = require("../../../../assets/screen_images/search-icon-2.png");
const searchIcon3 = require("../../../../assets/screen_images/search-icon-3.png");
const searchIcon4 = require("../../../../assets/screen_images/search-icon-4.png");
const close = require("../../../../assets/screen_images/close.png");
import BaiduMapRight from "./BaiduMapRight.vue";
import BaiduMapJian from "./BaiduMapJian.vue";
import BaiduMapTop from "./BaiduMapTop.vue";
import { find, isArray, isEmpty, floor } from "lodash";
import { styleJson } from "@/utils/constant";
const TowerHeightJson =
  '[{"point_name":"贵港根竹高铁LTE30-3","height":"35"},{"point_name":"贵港根竹乡支局（仅杆塔）","height":"45"},{"point_name":"港北区凤凰宾馆","height":"12"},{"point_name":"港北区根竹乡六黎屯","height":"40"},{"point_name":"GX贵港工商一所WCDMA","height":"12"},{"point_name":"贵港港城蓝田村","height":"19"},{"point_name":"贵港大圩旺岭高铁LTE27－5","height":"35"},{"point_name":"贵港大圩旺岭高铁12－1","height":"35"},{"point_name":"贵港港北大圩中西","height":"34"},{"point_name":"贵港港北区北环路牛路口LTE","height":"40"},{"point_name":"贵港港北区猪苗市场","height":"35"},{"point_name":"贵港港北区北环路逢福LTE","height":"30"},{"point_name":"贵港北环路基站无线机房","height":"50"},{"point_name":"贵港市北环路2LTE","height":"30"},{"point_name":"贵港港南区江一路63号江南生产楼九楼基站无线机房（仅杆塔）","height":"35"},{"point_name":"贵港港南区白石岭2LTE","height":"30"},{"point_name":"贵港覃塘上雷高铁14－1","height":"39"},{"point_name":"覃塘区北山路口桐岭村","height":"30"},{"point_name":"贵港覃塘六务高铁LTE31－2","height":"30"},{"point_name":"覃塘区石卡镇鹤心村","height":"40"},{"point_name":"贵港港北区西江农场清井分场LTE","height":"6"},{"point_name":"贵港港北区西江农场前进分场LTE","height":"3"},{"point_name":"港北区宏名中学水塔站","height":"30"},{"point_name":"贵港市石卡龙头LTE","height":"30"},{"point_name":"覃塘区杨志村","height":"40"},{"point_name":"覃塘区覃塘镇谷罗村","height":"15"},{"point_name":"覃塘区根竹镇新民村委","height":"30"},{"point_name":"覃塘区根竹镇泗民2","height":"30"},{"point_name":"贵港西江农场八队基站无线机房","height":"45"},{"point_name":"贵港武乐镇良联基站无线机房","height":"18"},{"point_name":"贵港覃塘镇甘碑村基站无线机房","height":"30"},{"point_name":"贵港市武乐高速收费站","height":"30"},{"point_name":"贵港市港南区贵港八塘大新村","height":"30"},{"point_name":"贵港石羊新村基站无线机房","height":"15"},{"point_name":"贵港石卡镇樟竹村基站无线机房（仅杆塔）","height":"45"},{"point_name":"贵港石卡镇山头","height":"45"},{"point_name":"贵港石卡镇陆村基站无线机房","height":"40"},{"point_name":"贵港石卡镇高速引路基站无线机房","height":"35"},{"point_name":"贵港蒙村","height":"35"},{"point_name":"贵港根竹乡三民村基站无线机房","height":"35"},{"point_name":"贵港根竹泗民基站无线机房","height":"0"},{"point_name":"贵港根竹汾水村","height":"35"},{"point_name":"贵港港南区南环勒竹LTE","height":"30"},{"point_name":"贵港港城镇旺华村基站无线机房","height":"35"},{"point_name":"贵港港城群山村","height":"19"},{"point_name":"贵港港城猫儿港","height":"19"},{"point_name":"贵港港城龙井村","height":"3"},{"point_name":"贵港港城东山村","height":"30"},{"point_name":"贵港大圩旺岭高铁LTE27-2","height":"30"},{"point_name":"贵港大圩东塘村","height":"3"},{"point_name":"贵港八塘镇山泉村基站无线机房","height":"45"},{"point_name":"港南区桥圩镇洋楼村","height":"30"},{"point_name":"港南区八塘镇下村","height":"30"},{"point_name":"港北区平富村2","height":"30"},{"point_name":"港北区根竹乡江口村一基站","height":"30"},{"point_name":"港北区葛民村","height":"30"},{"point_name":"港北区港北旺华2号站","height":"30"},{"point_name":"港北区大圩镇乐堂村","height":"40"},{"point_name":"港北区北环路上龙村","height":"30"},{"point_name":"GX贵港旺华","height":"19"},{"point_name":"GX贵港台泥工业园WCDMA","height":"30"},{"point_name":"GX贵港石卡大庆","height":"18"},{"point_name":"GX贵港大圩乐塘","height":"35"}]';

@Component({
  name: "BdMap",
  components: { BaiduMapRight, BaiduMapJian, BaiduMapTop }
})
export default class extends Vue {
  @Prop({ default: "" }) private regionCode!: any; //查询数据

  closeUrl: any = close;
  getDataObj: Object = {};
  AQInorm: any[] = [
    {
      min: 0,
      max: 50,
      name: "优",
      color: "#00E400",
      icons: icon1,
      icon: iconb1
    },
    {
      min: 51,
      max: 100,
      name: "良",
      color: "#FFFF00",
      icons: icon2,
      icon: iconb2
    },
    {
      min: 101,
      max: 150,
      name: "轻度污染",
      color: "#FF7E00",
      icons: icon3,
      icon: iconb3
    },
    {
      min: 151,
      max: 200,
      name: "中度污染",
      color: "#FF0000",
      icons: icon4,
      icon: iconb4
    },
    {
      min: 201,
      max: 300,
      name: "重度污染",
      color: "#99004C",
      icons: icon5,
      icon: iconb5
    },
    {
      min: 301,
      // max: 500,
      name: "严重污染",
      color: "#7E0023",
      icons: icon6,
      icon: iconb6
    }
  ];

  hls: any = null;
  hlsFull: any = null;

  jianNorm: any[] = [
    { min: 0, max: 0, icon: iconWarn3 },
    { min: 1, max: 5, icon: iconWarn1 },
    { min: 6, max: 10, icon: iconWarn2 },
    { min: 11, max: 999999999, icon: iconWarn4 }
  ];

  searchJianNorm: any[] = [
    { min: 0, max: 0, icon: searchIcon3 },
    { min: 1, max: 5, icon: searchIcon1 },
    { min: 6, max: 10, icon: searchIcon2 },
    { min: 11, max: 999999999, icon: searchIcon4 }
  ];
  pollution: any = ([] = [
    { name: "pM25", value: "" },
    { name: "PM10", value: "" },
    { name: "sO2", value: "" },
    { name: "nO2", value: "" },
    { name: "co", value: "" },
    { name: "o3", value: "" }
  ]);
  region: any = "广西";
  style: any = {
    width: "",
    height: ""
  };
  sendData: any = "";
  BaiduMapRightVisible: Boolean = false;
  BaiduMapJianVisible: Boolean = false;
  BaiduMapTopVisible: Boolean = false;
  fullScreenVisible: Boolean = false;
  videoUrl: any = "";
  cityName: string | undefined = "";
  screenWidth: any = document.body.clientWidth;
  screenHeight: any = document.body.clientHeight;
  height: any = "";
  width: any = "";
  map: any = "";
  bPoints: any[] = [];
  guoPonitList: any[] = [];
  axiosUrl: any = process.env.VUE_APP_SERVER_API;
  icon: any = "";
  jianIcon: any = "";
  fireForbidList: any[] = [];
  searchGuoList: any[] = [];
  searchJianList: any[] = [];
  guoDataObj: any = {};
  html: any = "";
  monitoring: any = "1";
  // 监控点数
  pointCount: any = 0;
  // 火点总数
  warnCount: any = 0;
  // 已处理总数
  doneCount: any = 0;

  chongzuoToken: string = "";
  currentVideoUrl: string = "";
  tokenTimer: any = null;

  fullScreenWidth: any = "";
  fullScreenHeight: any = "";
  lastInfoBox: any = ""; // 保存刚刚打开的marker
  towerHeights: any[] = [];
  pointNameLabel: any[] = []; // 监控点label
  guoPointLable: any[] = []; // 国控点label
  searchName: any = ""; // 监控点搜索
  timer: any = null;
  gxProvinces = [
    "南宁市",
    "柳州市",
    "桂林市",
    "梧州市",
    "北海市",
    "防城港市",
    "钦州市",
    "贵港市",
    "玉林市",
    "百色市",
    "贺州市",
    "河池市",
    "来宾市",
    "崇左市"
  ];
  @Watch("screenWidth")
  changescreenWidth(val: any) {
    // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
    if (!this.timer) {
      // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
      this.screenWidth = val;
      this.timer = true;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      setTimeout(function() {
        // 打印screenWidth变化的值
        console.log(that.screenWidth);
        that.timer = false;
      }, 400);
    }
  }
  @Watch("screenHeight")
  changescreenHeight(val: any) {
    // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
    if (!this.timer) {
      // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
      this.screenHeight = val;
      this.timer = true;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      setTimeout(function() {
        // 打印screenWidth变化的值
        console.log(that.screenHeight);
        that.timer = false;
      }, 400);
    }
  }
  @Watch("BaiduMapJianVisible")
  onPointChangeVisible(value: boolean) {
    if (!value) {
      this.tokenTimer = null;
    }
  }

  mounted() {
    // 反序列化铁塔高度json
    this.towerHeights = JSON.parse(TowerHeightJson);
    // 初始化地图
    map().then((rec: any) => {
      this.initChartMap(
        this.monitoring,
        this.region,
        this.searchGuoList,
        this.searchJianList
      );
      this.getFireForbidPoints(this.region);
    });

    // 地图自适应
    this.$nextTick(() => {
      this.style.width = document.documentElement.clientWidth + "px";
      this.style.height = document.documentElement.clientHeight - 60 + "px";
      this.width = document.documentElement.clientWidth + "px";
      this.height = document.documentElement.clientHeight - 300 + "px";

      this.fullScreenWidth =
        document.documentElement.clientWidth -
        document.documentElement.clientWidth * 0.2;
      this.fullScreenHeight =
        document.documentElement.clientHeight -
        60 -
        (document.documentElement.clientHeight - 60) * 0.2;
    });
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          this.style.width = document.documentElement.clientWidth + "px";
          this.style.height = document.documentElement.clientHeight - 60 + "px";
          this.width = document.documentElement.clientWidth + "px";
          this.height = document.documentElement.clientHeight - 300 + "px";
          this.fullScreenWidth =
            document.documentElement.clientWidth -
            document.documentElement.clientWidth * 0.2;
          this.fullScreenHeight =
            document.documentElement.clientHeight -
            60 -
            (document.documentElement.clientHeight - 60) * 0.2;

          this.sendHeight(this.height);
          this.sendWidth(this.width);
          this.sendStyle(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight
          );
          this.sendJianStyle(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight
          );
          // 重设中心
          setInterval(() => {
            this.setZoom(this.newPoints);
            return false;
          }, 3000);
        });
      })();
    };
  }

  setRegionBoundary() {
    const bdary = new BMap.Boundary();
    bdary.get("广西壮族自治区", (res: any) => {
      const pointArray: any[] = [];
      res.boundaries.forEach((bd: any) => {
        let ply = new BMap.Polyline(bd, {
          strokeColor: "#1A9FFA",
          strokeWeight: 2,
          enableMassClear: false
        });
        this.map.addOverlay(ply);
      });
      // setTimeout(() => {
      //   this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });
      // }, 500);
    });
  }

  /**
   * 获取禁烧区域点数据
   */
  getFireForbidPoints(region: any) {
    if (region) {
      axios
        .get(`api/gxfireforbidarea/getcityfireforbid?SZS=${region}`)
        .then(res => {
          this.fireForbidList = res.data;
          this.addFireForbidOverlay();
          this.setRegionBoundary();
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    } else {
      this.setRegionBoundary();
      this.gxProvinces.forEach(p => {
        axios
          .get(`api/gxfireforbidarea/getcityfireforbid?SZS=${p}`)
          .then(res => {
            this.fireForbidList = [...this.fireForbidList, ...res.data];
            this.addFireForbidOverlay(res.data);
          });
      });
    }
  }

  /**
   * 添加禁烧区覆盖物
   */
  addFireForbidOverlay(fireForbidList?: any[]) {
    const data = fireForbidList || this.fireForbidList;
    for (let i = 0; i < data.length; i++) {
      const points: any[] = [];
      data[i].forEach((e: any) => {
        points.push(new (window as any).BMap.Point(e[1], e[0]));
      });
      const polygon = new (window as any).BMap.Polygon(points, {
        strokeColor: "#F693FF",
        fillColor: "#F693FF",
        strokeWeight: 2,
        strokeOpacity: 0.15,
        fillOpacity: 0.15
      }); // 创建多边形
      this.map.addOverlay(polygon); // 增加多边形
    }
  }
  sendHeight(height: any) {
    this.$emit("height", height);
  }
  sendWidth(width: any) {
    this.$emit("width", width);
  }
  sendStyle(width: any, height: any) {
    this.$nextTick(() => {
      if (this.$refs.BaiduMapRight) {
        let BaiduMapRight: any = this.$refs.BaiduMapRight;
        BaiduMapRight.getStyle(width, height);
      }
    });
  }
  sendJianStyle(width: any, height: any) {
    this.$nextTick(() => {
      if (this.$refs.BaiduMapJian) {
        let BaiduMapJian: any = this.$refs.BaiduMapJian;
        BaiduMapJian.getStyle(width, height);
      }
    });
  }
  newPoints: any[] = [];
  // 异步加载地图
  init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map().then((BMap: any) => {
      this.newPoints = [];
      _this.initChartMap(
        this.monitoring,
        this.region,
        this.searchGuoList,
        this.searchJianList
      );
    });
  }

  initChartMap(
    monitoring: any,
    data: any,
    searchGuoList: any,
    searchJianList: any
  ) {
    this.map = new (window as any).BMap.Map("div1", {
      enableMapClick: false,
      minZoom: 8
    });

    this.map.clearOverlays(); // 去除地图标注
    this.map.centerAndZoom(data, 8); // 设置中心点
    this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    // this.map.setMapStyle({ style: "midnight" }); // 修改样式

    // 比例尺
    const scaleCtrl = new (window as any).BMap.ScaleControl({
      // eslint-disable-next-line no-undef
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      offset: new (window as any).BMap.Size(10, 40)
    });
    this.map.addControl(scaleCtrl);

    // 完整的缩放控件
    const opts: any = {
      // eslint-disable-next-line no-undef
      type: BMAP_NAVIGATION_CONTROL_LARGE,
      // eslint-disable-next-line no-undef
      anchor: BMAP_ANCHOR_TOP_RIGHT
    };
    this.map.addControl(new (window as any).BMap.NavigationControl(opts));

    // setTimeout(() => {
    //   this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });
    // }, 500);
  }

  // 监控点标注
  jianMarker(regionName: any, searchJianList: any, searchName?: any) {
    this.pointNameLabel = [];
    this.map.centerAndZoom(regionName, 12); // 设置中心点
    for (let i = 0; i < searchJianList.length; i++) {
      for (let j = 0; j < this.jianNorm.length; j++) {
        if (
          this.jianNorm[j].min <= searchJianList[i].warning &&
          searchJianList[i].warning <= this.jianNorm[j].max
        ) {
          if (searchName) {
            this.jianIcon = new (window as any).BMap.Icon(
              this.searchJianNorm[j].icon,
              new (window as any).BMap.Size(46, 60),
              {
                // 图片大小
                // anchor: new window.BMap.Size(10, 0) // 这个是信息窗口位置
              }
            );
          } else {
            this.jianIcon = new (window as any).BMap.Icon(
              this.jianNorm[j].icon,
              new (window as any).BMap.Size(46, 60),
              {
                // 图片大小
                // anchor: new window.BMap.Size(10, 0) // 这个是信息窗口位置
              }
            );
          }

          const jianIcon = this.jianIcon;
          const point = new (window as any).BMap.Point(
            searchJianList[i].mapJd,
            searchJianList[i].mapWd
          ); // 将标注点转化成地图上的点

          this.bPoints.push(point); // 添加到百度坐标数组 用于自动调整缩放级别
          const marker = new (window as any).BMap.Marker(point, {
            icon: jianIcon
          });

          // 设置文字
          const textPoint = new (window as any).BMap.Point(
            searchJianList[i].mapJd,
            searchJianList[i].mapWd
          ); // 创建坐标点

          let opts = {};
          if (searchName) {
            opts = {
              position: textPoint, // 指定文本标注所在的地理位置
              offset: new (window as any).BMap.Size(-7, -17) // 设置文本偏移量
            };
          } else {
            opts = {
              position: textPoint, // 指定文本标注所在的地理位置
              offset: new (window as any).BMap.Size(-10, -23) // 设置文本偏移量
            };
          }

          const label = new (window as any).BMap.Label(
            searchJianList[i].warning,
            opts,
            {
              offset: new (window as any).BMap.Size(0, 0)
            }
          ); // 创建文本标注对象

          label.setStyle({
            color: "rgb(142, 26, 21)",
            backgroundColor: "transparent", // 文本背景色
            borderColor: "transparent", // 文本框边框色
            fontSize: "12px",
            fontFamily: "微软雅黑"
          });

          const pointNameSize = new (window as any).BMap.Point(
            searchJianList[i].mapJd,
            searchJianList[i].mapWd
          ); // 创建坐标点
          const pointNameOpts = {
            position: pointNameSize, // 指定文本标注所在的地理位置
            offset: new (window as any).BMap.Size(-50, 0) // 设置文本偏移量
          };

          const pointNameLabel = new (window as any).BMap.Label(
            searchJianList[i].pointName,
            pointNameOpts,
            {
              offset: new (window as any).BMap.Size(0, 0)
            }
          ); // 创建文本标注对象

          pointNameLabel.setStyle({
            color: "#ffffff",
            backgroundColor: "transparent", // 文本背景色
            borderColor: "transparent", // 文本框边框色
            fontSize: "12px",
            fontFamily: "微软雅黑"
          });
          this.pointNameLabel.push(pointNameLabel);
          // this.map.addOverlay(pointNameLabel)

          this.map.addOverlay(label);
          // 将点转化成标注点
          this.map.addOverlay(marker); // 将标注点添加到地图上

          const _this = this;
          marker.addEventListener("click", function(e: any) {
            _this.jianClick(marker, searchJianList[i]);
          });

          // this.map.addOverlay(pointNameLabel)
        }
      }
    }
    const _this = this;
    this.map.addEventListener("zoomend", () => {
      setTimeout(() => {
        for (let i = 0; i < _this.pointNameLabel.length; i++) {
          if (_this.map.getZoom() > 13) {
            _this.map.addOverlay(_this.pointNameLabel[i]);
          } else {
            _this.map.removeOverlay(_this.pointNameLabel[i]);
          }
        }
      }, 300);
    });
  }

  zeroClick() {
    this.map.clearOverlays();
    this.addFireForbidOverlay();
    const newList = [];
    for (let i = 0; i < this.searchJianList.length; i++) {
      if (this.searchJianList[i].warning === 0) {
        newList.push(this.searchJianList[i]);
      }
    }
    // console.log
    this.jianMarker(this.regionName, newList);
    this.addGuoMarker(this.regionName, this.searchGuoList);
  }
  fiveClick() {
    this.map.clearOverlays();
    this.addFireForbidOverlay();
    const newList = [];
    for (let i = 0; i < this.searchJianList.length; i++) {
      if (
        this.searchJianList[i].warning > 0 &&
        this.searchJianList[i].warning <= 5
      ) {
        newList.push(this.searchJianList[i]);
      }
    }
    this.jianMarker(this.regionName, newList);
    this.addGuoMarker(this.regionName, this.searchGuoList);
  }
  tenClick() {
    this.map.clearOverlays();
    this.addFireForbidOverlay();
    const newList = [];
    for (let i = 0; i < this.searchJianList.length; i++) {
      if (
        this.searchJianList[i].warning > 5 &&
        this.searchJianList[i].warning <= 10
      ) {
        newList.push(this.searchJianList[i]);
      }
    }
    // console.log
    this.jianMarker(this.regionName, newList);
    this.addGuoMarker(this.regionName, this.searchGuoList);
  }
  maxClick() {
    this.map.clearOverlays();
    this.addFireForbidOverlay();
    const newList = [];
    for (let i = 0; i < this.searchJianList.length; i++) {
      if (this.searchJianList[i].warning > 10) {
        newList.push(this.searchJianList[i]);
      }
    }
    // console.log
    this.jianMarker(this.regionName, newList);
    this.addGuoMarker(this.regionName, this.searchGuoList);
  }
  // 是否为m3u8格式
  isLiveUrl(url: string) {
    // return /\.(m3u8)/i.test(url);
    return url.includes(".m3u8");
  }
  // 点击监控点
  async jianClick(marker: any, pointObj: any) {
    this.BaiduMapJianVisible = true;
    this.BaiduMapRightVisible = false;

    this.map.panTo(marker.point);

    if (pointObj.cityName === "崇左市") {
      const { data } = await axios.get("/api/public/chongzuotoken");
      this.chongzuoToken = data || "";
    }

    // 获取杆的高度
    const result = find(
      this.towerHeights,
      a => a.point_name === pointObj.point_name
    );
    pointObj.height = result ? result.height : "-";

    this.currentVideoUrl =
      pointObj.cityName === "崇左市"
        ? `${pointObj.videoUrl}?token=${this.chongzuoToken}`
        : pointObj.videoUrl;

    console.log(pointObj, this.currentVideoUrl);
    const opts = {
      boxStyle: {
        background: "url(/img/img-bg01.2e383400.png) no-repeat 100% 100%",
        width: "360px",
        height: "270px"
      },
      closeIconUrl: `${close}`,
      closeIconMargin: "5px 5px 0 0",
      enableAutoPan: false,
      enableCloseOnClick: true
    };
    let serverUrl = process.env.VUE_APP_SERVER_API;
    const html = `
        <div class="jianContent">
          <div class="unit">
            <div> ${pointObj.pointName}</div>
          </div>
          <div class="unit">
            铁塔高度：${pointObj.height}
          </div>
          <div class="unit">
           当日火点信息：${pointObj.warning}
          </div>
          <div class="unit" id="demo">
            ${
              this.isLiveUrl(this.currentVideoUrl)
                ? '<video class="video" id="live" width="100%" height="100%" controls="controls"></video>'
                : `<iframe class="iframe" id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src="${this.currentVideoUrl}"></iframe>`
            }
          <div>
           ${
             true
               ? ""
               : `<a href="${serverUrl}/files/插件.rar" title="点击下载插件，安装后请使用IE浏览器打开监控大屏。" class="tips"><i style="margin-right:5px;" class="el-icon-question"></i>视频未正常播放？</a>`
           }
           <div class='fullScreenButtom' id='fullScreenButtom'>
              <i class="el-icon-full-screen"></i>
              放大
            </div></div>
          </div>
        </div>

         `;
    const _this = this;
    const infoWindow = new (window as any).BMapLib.InfoBox(
      _this.map,
      html,
      opts
    );
    (window as any).lastInfoBox = null; // 定义上一个窗体为lastInfoBox;
    this.sendJianData(pointObj);
    // infoWindow.close(marker);
    if (_this.lastInfoBox) {
      // 判断上一个窗体是否存在，若存在则执行close
      _this.lastInfoBox.close();
    }
    _this.lastInfoBox = infoWindow;
    infoWindow.open(marker);

    const video: any = document.getElementById("live");
    const videoSrc = this.currentVideoUrl;

    if (video?.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video?.addEventListener("loadedmetadata", function() {
        video?.play();
      });
    } else if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(videoSrc);
      this.hls.attachMedia(video as HTMLMediaElement);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        (video as HTMLMediaElement).play();
      });
      this.hls.on(Hls.Events.ERROR, (event: any, data: any) => {
        console.log(data);
      });
    }

    _this.BaiduMapJianVisible = true;
    let fullScreenButtom: any = document.getElementById("fullScreenButtom");
    fullScreenButtom.addEventListener("click", function(e: any) {
      // let demo: any = document.getElementById("demo");
      // demo.style.display = "none";
      _this.fullScreen(videoSrc, pointObj.cityName);
    });
    infoWindow.addEventListener("close", function(e: any) {
      infoWindow.close(marker);
      _this.hls.destroy();
      _this.fullScreenVisible = false;
      _this.BaiduMapRightVisible = false;
      _this.BaiduMapJianVisible = false;
    });
    // infoWindow.close(marker)
  }
  BaiduMapJianData: any = {};
  sendJianData(pointObj: any) {
    this.BaiduMapJianVisible = false;
    axios
      .get("/api/monitorypoint/getmappointdetail", {
        params: { pointCode: pointObj.pointCode }
      })
      .then(res => {
        this.getDataObj = res.data;
        this.BaiduMapJianData = {
          pointObj,
          DataObj: this.getDataObj
        };
        this.BaiduMapJianVisible = true;
      });
  }
  fullScreen(videoUrl: any, cityName?: string) {
    this.videoUrl = videoUrl;
    this.cityName = cityName;
    this.fullScreenVisible = true;
    this.$nextTick(() => {
      const video = document.getElementById("liveFull");
      const videoSrc = this.videoUrl;
      if (Hls.isSupported()) {
        this.hlsFull = new Hls();
        this.hlsFull.loadSource(videoSrc);
        this.hlsFull.attachMedia(video as HTMLMediaElement);
        this.hlsFull.on(Hls.Events.MANIFEST_PARSED, () => {
          (video as HTMLMediaElement).play();
        });
      }
      // if (cityName !== "崇左市") {
      //   const video = document.getElementById("liveFull");
      //   const videoSrc = this.videoUrl;
      //   if (Hls.isSupported()) {
      //     this.hlsFull = new Hls();
      //     this.hlsFull.loadSource(videoSrc);
      //     this.hlsFull.attachMedia(video as HTMLMediaElement);
      //     this.hlsFull.on(Hls.Events.MANIFEST_PARSED, () => {
      //       (video as HTMLMediaElement).play();
      //     });
      //   }
      // } else {
      //   const fullScreen = document.getElementById("fullScreen");
      //   // `<embed type="application/x-vlc-plugin" pluginspage="http://www.videola.org" id="vlc" version="VideoLAN.VLCPlugin.2" autoplay="yes" loop="no" target="${this.videoUrl}">`
      //   const embed = document.createElement("embed");
      //   embed.type = "application/x-vlc-plugin";
      //   embed.setAttribute("pluginspage", "http://www.videola.org");
      //   embed.setAttribute("id", "vlc");
      //   embed.setAttribute("version", "VideoLAN.VLCPlugin.2");
      //   embed.setAttribute("autoplay", "yes");
      //   embed.setAttribute("loop", "no");
      //   embed.setAttribute("target", this.videoUrl);
      //   embed.width = "100%";
      //   embed.height = "100%";
      //   fullScreen?.appendChild(embed);
      // }
    });
  }
  fullScreenClose() {
    this.fullScreenVisible = false;
    this.cityName = "";
    this.hlsFull?.destroy();
    // document.getElementById('demo').style.display = 'block'
  }
  markers: any[] = [];
  // 循环建立标注点
  addGuoMarker(regionName: any, searchGuoList: any, searchName?: any) {
    this.map.centerAndZoom(regionName, 12); // 设置中心点
    for (let i = 0; i < searchGuoList.length; i++) {
      for (let j = 0; j < this.AQInorm.length; j++) {
        if (
          this.AQInorm[j].min < searchGuoList[i].aqi &&
          searchGuoList[i].aqi <= this.AQInorm[j].max
        ) {
          this.icon = new (window as any).BMap.Icon(
            this.AQInorm[j].icons,
            new (window as any).BMap.Size(46, 60),
            {
              // 图片大小
              // anchor: new window.BMap.Size(10, 0) // 这个是信息窗口位置
            }
          );
          // 设置监控点icon
          const icon = this.icon;
          const point = new (window as any).BMap.Point(
            searchGuoList[i].mapLng,
            searchGuoList[i].mapLat
          ); // 将标注点转化成地图上的点

          this.bPoints.push(point); // 添加到百度坐标数组 用于自动调整缩放级别
          const marker = new (window as any).BMap.Marker(point, {
            icon: icon
          }); // 将点转化成标注点

          const pointNameSize = new (window as any).BMap.Point(
            searchGuoList[i].mapLng,
            searchGuoList[i].mapLat
          ); // 创建坐标点
          const pointNameOpts = {
            position: pointNameSize, // 指定文本标注所在的地理位置
            offset: new (window as any).BMap.Size(-30, 25) // 设置文本偏移量
          };

          const pointNameLabel = new (window as any).BMap.Label(
            searchGuoList[i].jcdd,
            pointNameOpts,
            {
              offset: new (window as any).BMap.Size(0, 0)
            }
          ); // 创建文本标注对象

          pointNameLabel.setStyle({
            color: "#ffffff",
            backgroundColor: "transparent", // 文本背景色
            borderColor: "transparent", // 文本框边框色
            fontSize: "12px",
            fontFamily: "微软雅黑"
          });

          this.guoPointLable.push(pointNameLabel);
          this.map.addOverlay(marker); // 将标注点添加到地图上
          const _this = this;
          marker.addEventListener("click", function() {
            if (_this.bereMaker) {
              //遍历地图上所以的标注
              let markObj = _this.map.getOverlays().filter((item: any) => {
                return (
                  item.point &&
                  item.point.lat == _this.bereMaker.mapLat &&
                  item.point.lng == _this.bereMaker.mapLng
                );
              });
              if (markObj[0]) {
                markObj[0].setIcon(
                  new BMap.Icon(
                    _this.AQInorm[_this.iconIndex].icons,
                    new BMap.Size(46, 60)
                  )
                );
              }
            }
            _this.guoClick(marker, searchGuoList[i]);
            marker.setIcon(
              new BMap.Icon(_this.AQInorm[j].icon, new BMap.Size(46, 60))
            );
            _this.bereMaker = searchGuoList[i];
            _this.iconIndex = j;
          });
        }
      }
    }
  }
  iconIndex: any = "";
  bereMaker: any = null;
  guoClick(marker: any, pointObj: any) {
    let point = {
      lat: pointObj.mapLat,
      lng: pointObj.mapLng
    };
    this.BaiduMapJianVisible = false;
    this.BaiduMapRightVisible = true;
    this.map.panTo(marker.point);
    const _this = this;
    axios
      .get("/api/gxenvironment/getenvstationmappaneldetail", {
        params: {
          SZS: pointObj.szs,
          JCDD: pointObj.jcdd
        }
      })
      .then(res => {
        this.BaiduMapRightVisible = true;
        pointObj.kqjb = res.data?.real?.kqjb || "";
        _this.openGuoPoint(marker, pointObj, res.data);
      });
  }
  BaiduMapRightData: any = {};
  openGuoPoint(marker: any, pointObj: any, guoDataObj: any) {
    for (const i in guoDataObj.real) {
      for (const j in this.pollution) {
        if (i === this.pollution[j].name) {
          this.pollution[j].value = guoDataObj.real[i];
        }
      }
    }
    for (let i = 0; i < this.pollution.length; i++) {
      for (let j = 0; j < this.AQInorm.length; j++) {
        if (
          this.AQInorm[j].min < this.pollution[i].value &&
          this.pollution[i].value <= this.AQInorm[j].max
        ) {
          this.pollution[i].color = this.AQInorm[j].color;
        }
      }
    }
    this.BaiduMapRightData = {
      pointObj,
      DataObj: guoDataObj
    };
    // BaiduMapRight.getData(pointObj, guoDataObj);
    const html = `
       <div class="content">
          <div class="unit">
            <div class="one_left">空气检测站：${pointObj.jcdd}</div>
           <div class="one_right" style="visibility: hidden;">
           类型：${pointObj.type}
           </div>
          </div>
          <div class="unit">
            <div class="two_left">AQI：${pointObj.aqi}</div>
            <div class="two_right">级别：${pointObj.kqjb}</div>
          </div>
          <div class="unit">
            <div class="three">时间：${guoDataObj.real.time}</div>
          </div>
          <div class="unit">
            <div class="item">
              <span class="item_left">PM2.5</span>
              <span class="item_right">${guoDataObj.real.pM25}</span>
            </div>
            <div class="item">
              <span class="item_left">PM10</span>
              <span class="item_right">${guoDataObj.real.pM10}</span>
            </div>

            <div class="item">
              <span class="item_left">SO2</span>
              <span class="item_right">${guoDataObj.real.sO2}</span>
            </div>

            <div class="item">
              <span class="item_left">NO2</span>
              <span class="item_right">${guoDataObj.real.nO2}</span>
            </div>

            <div class="item">
              <span class="item_left">CO</span>
              <span class="item_right">${guoDataObj.real.co}</span>
            </div>

            <div class="item">
              <span class="item_left">O3</span>
              <span class="item_right">${guoDataObj.real.o3}</span>
            </div>
          </div>
        </div>
     `;
    const opts = {
      boxStyle: {
        background: "url(/img/img-bg01.2e383400.png) no-repeat 100% 100%",
        width: "360px",
        ght: "270px"
      },
      closeIconUrl: `${close}`,
      closeIconMargin: "5px 5px 0 0",
      enableAutoPan: false
    };
    const _this = this;
    // 开启信息窗口
    const infoWindow = new (window as any).BMapLib.InfoBox(
      _this.map,
      html,
      opts
    );
    // infoWindow.close(marker)
    if (_this.lastInfoBox) {
      // 判断上一个窗体是否存在，若存在则执行close
      _this.lastInfoBox.close();
    }
    _this.lastInfoBox = infoWindow;
    infoWindow.open(marker);
    _this.BaiduMapRightVisible = true;
    infoWindow.addEventListener("close", function(e: any) {
      // alert(e.type);
      infoWindow.close(marker);
      _this.BaiduMapRightVisible = false;
      _this.BaiduMapJianVisible = false;
      marker.setIcon(
        new BMap.Icon(
          _this.AQInorm[_this.iconIndex].icons,
          new BMap.Size(46, 60)
        )
      );
    });
  }
  // 设置批量标注点的中心
  setZoom(bPoints: any) {
    // eslint-disable-next-line no-eval
    const view = this.map.getViewport(eval(bPoints));
    const mapZoom = view.zoom;
    const centerPoint = view.center;
    this.map.centerAndZoom(centerPoint);
  }
  regionName: any = "";
  search(
    isInit: boolean = false,
    monitoring: any,
    regionName: any,
    searchGuoList: any,
    searchJianList: any,
    searchName: any
  ) {
    this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });

    this.searchJianList = searchJianList;
    this.searchGuoList = searchGuoList;
    this.regionName = regionName;
    let searchNameJianList = [];
    let searchNameGuoist = [];
    if (searchName) {
      searchNameJianList = searchJianList.filter(
        (item: any) => item.pointName.indexOf(searchName) > -1
      );
      searchNameGuoist = searchGuoList.filter(
        (item: any) => item.jcdd.indexOf(searchName) > -1
      );
    } else {
      searchNameJianList = searchJianList;
      searchNameGuoist = searchGuoList;
    }
    this.map.clearOverlays();

    if (monitoring === "1") {
      this.addGuoMarker(regionName, searchNameGuoist, searchName);
      this.jianMarker(regionName, searchNameJianList, searchName);
    }
    if (monitoring === "2") {
      this.jianMarker(regionName, searchNameJianList, searchName);
    }
    if (monitoring === "3") {
      this.addGuoMarker(regionName, searchNameGuoist, searchName);
    }

    this.getStatisticsData(regionName);
    this.getFireForbidPoints(regionName);

    // this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });
    // setTimeout(() => {
    //   this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });
    // }, 500);
  }

  /**
   * 获取顶部统计数据
   */
  getStatisticsData(regionName: any) {
    axios
      .get("/api/monitorypoint/getpointwarningstatistics", {
        params: { cityCode: this.regionCode }
      })
      .then(res => {
        const { data } = res;
        this.pointCount = data.pointCount;
        this.warnCount = data.warningCount;
        this.doneCount = data.warningSolvegetCount;
        this.BaiduMapTopVisible = true;
      });
  }

  clear() {
    this.init();
    this.BaiduMapRightVisible = false;
    this.BaiduMapJianVisible = false;
  }
}
</script>

<style lang="scss">
.statistics-screen-2 #div1 {
  background-color: #0b131d !important;
}

.anchorBL {
  display: none;
}
.content {
  width: 360px;
  height: 270px;
  overflow: hidden;
  overflow-y: auto;
  padding: 10px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(/img/img-bg01.2e383400.png);
}
.jianContent {
  width: 360px;
  min-height: 280px;
  overflow: hidden;
  overflow-y: auto;
  padding: 10px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("../../../../assets/screen_images/img-bg01.2e383400.png");
}
.jianContent .unit {
  color: #ffffff;
}
.unit {
  margin: 5px;
}
.tips {
  float: left;
  margin-top: 5px;
}

.iframe {
  width: 100%;
}
.fullScreenButtom {
  float: right;
  font-size: 20px;
}
.one_left {
  float: left;
  margin: 5px 0;
  width: 60%;
  color: #ffffff;
}
.one_right {
  float: left;
  margin: 5px 0;
  width: 39%;
  color: #ffffff;
}
.two_left {
  float: left;
  margin: 5px 0;
  width: 60%;
  color: #25e268;
}
.two_right {
  float: left;
  margin: 5px 0;
  width: 39%;
  color: #25e268;
}
.three {
  color: #ffffff;
  margin: 5px 0;
  width: 100%;
}
.item {
  float: left;
  background: #19437a;
  padding: 5px;
  margin-left: 3px;
  margin-top: 8px;
  width: 100px;
}
.item_left {
  color: #ffffff;
  font-size: 9px;
}
.item_right {
  // text-align: right;
  color: #25e268;
  float: right;
  font-size: 20px;
}
.item_unit {
  color: #25e268;
  font-size: 9px;
}
.rightBottom {
  width: 140px;
  padding: 10px;
  position: absolute;
  right: 30px;
  bottom: 70px;
  // transform: translate(-50%, -50%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(/img/img-bg01.2e383400.png);
  z-index: -1;
}
@media screen and (max-width: 1366px) {
  .rightBottom {
    font-size: 10px;
  }
  .jianContent {
    font-size: 14px;
  }
  .fullScreenButtom {
    font-size: 16px;
  }
}
.fullScreenIframe {
  width: 100%;
  height: 100%;
}
.closeUrl {
  // position: absolute;
  float: right;
}
</style>
