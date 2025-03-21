<template>
  <!-- eslint-disable -->
  <div class="statistics-screen-3">
    <el-tabs v-model="activeName" @tab-click="onScreenChange">
      <el-tab-pane label="火点展示" name="火点展示" />
      <el-tab-pane label="火点列表" name="火点列表" />
    </el-tabs>
    <div
      class="statistics-frame"
      :style="
        activeName === '火点展示'
          ? { background: 'none', margin: '12px 0 0 0' }
          : { height: 'calc(100vh - 74.2px - 29px)' }
      "
    >
      <template v-if="activeName === '火点展示'">
        <el-row :gutter="20">
          <el-col :span="15">
            <div class="statistics-subframe" style="margin-left: 10px;">
              <el-form
                :inline="true"
                class="statistics-frame_form is-pdbless"
                style="height: calc((100vh - 74.2px) / 12);"
              >
                <el-form-item>
                  <h4 class="statistics__subtitle" style="margin-right: 20px;">
                    火点热力图
                  </h4>
                </el-form-item>
                <el-form-item label="地市/区县">
                  <el-select
                    size="small"
                    v-model="formHeatMap.cityCode"
                    placeholder="请选择地市/区县"
                    @change="handleHeatAreaChange"
                  >
                    <el-option
                      v-for="item in provinceList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="火点时间">
                  <el-date-picker
                    style="width:250px;"
                    size="small"
                    v-model="formHeatMap.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="起始时间"
                    end-placeholder="结束时间"
                    @change="handleHeatDateChange"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button
                    icon="el-icon-refresh-left"
                    type="primary"
                    size="small"
                    @click="resetHeatForm"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
              <div class="statistics-map">
                <div id="map"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="statistics-subframe" style="margin-right: 10px;">
              <el-form
                :inline="true"
                class="statistics-frame_form is-pdbless"
                id="staticForm"
              >
                <el-row>
                  <el-col :xl="{ span: 5 }">
                    <el-form-item>
                      <h4
                        class="statistics__subtitle"
                        style="margin-right: 5px;"
                      >
                        火点数据统计
                      </h4>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="{ span: 6 }">
                    <el-form-item label="统计类型">
                      <el-select
                        size="small"
                        v-model="formStatistics.type"
                        placeholder="请选择类型"
                        style="width: 85px;"
                        @change="handleTypeChange"
                      >
                        <el-option label="城市" value="1" />
                        <el-option label="区县" value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="{ span: 13 }">
                    <el-form-item label="火点时间">
                      <el-date-picker
                        style="width:250px;"
                        size="small"
                        v-model="formStatistics.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="起始时间"
                        end-placeholder="结束时间"
                        @change="handleStatisticsDateChange"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item style="margin-bottom: 16px;" id="heatBtn">
                  <el-button
                    icon="el-icon-refresh-left"
                    type="primary"
                    size="small"
                    @click="resetStatisticeForm"
                    >重置</el-button
                  >
                  <el-button
                    icon="el-icon-download"
                    size="small"
                    @click="exportHeatExcel"
                    >导出</el-button
                  >
                </el-form-item>
              </el-form>
              <el-table
                :data="heatList"
                v-loading="loading"
                :span-method="objectSpanMethod"
                :max-height="tableHeatHeight"
                border
                class="statistics-map__list"
              >
                <template v-if="formStatistics.type === '1'">
                  <el-table-column
                    prop="name"
                    label="城市"
                    width="120"
                  ></el-table-column>
                  <el-table-column
                    prop="pointCount"
                    label="监控点位数(个)"
                  ></el-table-column>
                  <el-table-column
                    prop="warningCount"
                    label="火点数(个)"
                  ></el-table-column>
                  <el-table-column
                    prop="solvegetCount"
                    label="已处理(个)"
                  ></el-table-column>
                  <el-table-column
                    prop="rate"
                    label="火点处理率(%)"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.rate !== null">{{
                        scope.row.rate
                      }}</span>
                      <span v-else>—</span>
                    </template>
                  </el-table-column>
                </template>
                <template v-else>
                  <el-table-column
                    prop="cityName"
                    label="城市"
                    width="120"
                  ></el-table-column>
                  <el-table-column prop="name" label="区县"></el-table-column>
                  <el-table-column
                    prop="warningCount"
                    label="火点数(个)"
                  ></el-table-column>
                  <el-table-column
                    prop="solvegetCount"
                    label="已处理(个)"
                  ></el-table-column>
                  <el-table-column
                    prop="solvegetRate"
                    label="火点处理率(%)"
                    width="200"
                  ></el-table-column>
                </template>
              </el-table>
              <!-- <div class="statistics__tips">{{ heatTips }}</div> -->
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-if="activeName === '火点列表'">
        <el-form :inline="true" class="statistics-frame_form" id="staticForm2">
          <el-form-item label="地市/区县">
            <el-cascader
              size="small"
              v-model="formData.codeArr"
              :props="{ checkStrictly: true }"
              :options="cityList"
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="火点类型">
            <el-select
              size="small"
              v-model="formData.type"
              placeholder="请选择火点类型"
            >
              <el-option
                v-for="(item, index) in warningtypeoptions"
                :key="index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="点位名称">
            <el-input
              size="small"
              v-model.trim="formData.keyword"
              placeholder="请输入搜索的点位名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select
              size="small"
              v-model="formData.isSolveget"
              placeholder="请选择处理状态"
            >
              <el-option label="未处理" :value="0"></el-option>
              <el-option label="已处理" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="火点时间">
            <el-date-picker
              style="width:250px;"
              size="small"
              v-model="formData.date"
              type="daterange"
              range-separator="至"
              start-placeholder="起始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="small"
              @click="searchForm"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh-left"
              type="primary"
              size="small"
              @click="reSetForm"
              >重置</el-button
            >
            <el-button icon="el-icon-download" size="small" @click="exportExcel"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
        <div style="padding:0 20px;">
          <el-table
            :data="tableData"
            :maxHeight="tableHeight"
            v-loading="loading"
            style="width: 100%;"
          >
            <el-table-column prop="cityName" label="地市"></el-table-column>
            <el-table-column prop="countyName" label="区县"></el-table-column>
            <!-- <el-table-column prop="type" label="火点类型"></el-table-column> -->
            <el-table-column
              prop="pointName"
              label="点位名称"
            ></el-table-column>
            <el-table-column
              prop="warningAddress"
              label="火点地点"
            ></el-table-column>
            <el-table-column prop="longitude" label="经度"></el-table-column>
            <el-table-column prop="latitude" label="纬度"></el-table-column>
            <el-table-column
              prop="crateTimeLabel"
              label="火点时间"
            ></el-table-column>
            <el-table-column
              prop="solvegetImgsArray"
              label="火点图片"
              width="120px"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="
                    scope.row.solvegetImgsArray &&
                      scope.row.solvegetImgsArray.length
                  "
                  @click="openImage(scope.row.solvegetImgsArray)"
                  style="cursor:pointer;"
                  size="small"
                  >查看图片</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="imgs" label="处理后图片" width="120px">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.imgs && scope.row.imgs.length"
                  @click="openImage(scope.row.imgs)"
                  style="cursor:pointer;"
                  size="small"
                  >查看图片</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="isSolvegetLabel"
              label="处理状态"
            ></el-table-column>
            <el-table-column
              prop="solvegetTimeLabel"
              label="处理时间"
            ></el-table-column>
          </el-table>
          <div
            style="heigth:80px;text-align:right;margin-top:15px;"
            id="pagination"
          >
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="formData.page"
              :page-sizes="[10, 50, 100, 200]"
              :page-size="formData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="formData.total"
            ></el-pagination>
          </div>
        </div>
      </template>
    </div>
    <el-dialog
      title="火点图片"
      :visible.sync="dialogVisible"
      width="65%"
      top="8vh"
      @close="
        () => {
          imgUrls = [];
        }
      "
    >
      <div
        style="width:100%;min-height:300px;text-align:center;font-size:22px;margin-top: -16px;"
      >
        <div v-if="imgUrls.length">
          <img
            v-for="(item, index) in imgUrls"
            :key="index"
            style="max-width:100%;"
            :src="item"
            class="img-item"
          />
        </div>
        <div v-else>暂无图片</div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Axios from "axios";
import moment from "moment";
import { log } from "util";
import { map } from "@/views/statistics-screen/screen-2/map";
import { styleJson } from "@/utils/constant";
import { max, isEmpty } from "lodash";

type Point = {
  lng?: number;
  lat?: number;
};

@Component({
  name: "SplitScreenOne",
  components: {}
})
export default class extends Vue {
  private activeName = "火点展示";
  private map: any = null;
  formData: any = {
    keyword: undefined,
    type: undefined,
    codeArr: [""],
    date: null,
    isSolveget: null,
    page: 1,
    pageSize: 10,
    total: 0
  };
  formHeatMap: any = {
    cityCode: "全部",
    date: []
  };
  formStatistics: any = {
    type: "1",
    date: []
  };
  dialogVisible: Boolean = false;
  pagination: any = {
    page: 1,
    pageSize: 10,
    total: 0
  };
  imgUrls: string[] = [];
  tableData: any[] = [];
  loading: Boolean = false;
  tableHeight: Number = 750;
  tableHeatHeight: Number = 750;

  @Watch("activeName", {
    immediate: true
  })
  onTabsChange(value: string) {
    if (value === "火点展示") {
      this.reSetForm();
      this.init();
      this.$nextTick(() => {
        let clientWidth = document.body.clientWidth;
        let clientHeight = document.body.clientHeight;
        let subframeH = (document.querySelector(".statistics-subframe") as any)
          .offsetHeight;
        let otherH = clientWidth < 2168 ? 156 : 100;

        let staticFormH = (document.querySelector("#staticForm") as any)
          .offsetHeight;

        if (clientWidth < 2168 && clientHeight <= 1080) {
          (document.querySelector("#heatBtn") as any).style.marginTop = "-16px";
          (document.querySelector("#heatBtn") as any).style.marginBottom =
            "8px";
        } else {
          (document.querySelector("#heatBtn") as any).style.marginTop = 0;
          (document.querySelector("#heatBtn") as any).style.marginBottom =
            "16px";
        }

        let offsetH = clientWidth < 2168 && clientHeight <= 1080 ? 28 : 0;
        this.tableHeatHeight = subframeH - (staticFormH + offsetH);
      });
    }

    if (value === "火点列表") {
      this.reSetForm();
      this.getHeatList();
      this.$nextTick(() => {
        let clientWidth = document.body.clientWidth;
        let clientHeight = document.body.clientHeight;
        let subframeH = (document.querySelector(".statistics-frame") as any)
          .offsetHeight;

        let staticFormH2 = (document.querySelector("#staticForm2") as any)
          .offsetHeight;

        let pagination = (document.querySelector("#pagination") as any)
          .offsetHeight;

        let offsetH = clientWidth < 2168 && clientHeight <= 1080 ? 28 : 0;
        this.tableHeight =
          subframeH - (staticFormH2 + offsetH + pagination + 30);
      });
    }
  }

  created() {
    let clientWidth = document.body.clientWidth;
    let clientHeight = document.body.clientHeight;
    // this.tableHeight = clientWidth > 1366 ? 700 : 400;
    // this.tableHeatHeight = clientWidth > 1366 ? 1030 : 530;
    this.searchForm();
    this.getWarningtypeoptions();
    this.getTreeoptions();
    this.getOptionsBySpecificLevel();

    window.addEventListener("resize", e => {
      let clientWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;
      if (document.querySelector(".statistics-subframe")) {
        if (this.activeName === "火点展示") {
          let subframeH = (document.querySelector(
            ".statistics-subframe"
          ) as any).offsetHeight;
          let otherH = clientWidth < 2168 ? 156 : 100;

          let offsetH = clientWidth < 2168 && clientHeight <= 1080 ? 28 : 0;

          let staticFormH = (document.querySelector("#staticForm") as any)
            .offsetHeight;

          if (clientWidth < 2168 && clientHeight <= 1080) {
            (document.querySelector("#heatBtn") as any).style.marginTop =
              "-16px";
            (document.querySelector("#heatBtn") as any).style.marginBottom =
              "8px";
          } else {
            (document.querySelector("#heatBtn") as any).style.marginTop = 0;
            (document.querySelector("#heatBtn") as any).style.marginBottom =
              "16px";
          }

          this.tableHeatHeight = subframeH - (staticFormH + offsetH);
        }

        if (this.activeName === "火点列表") {
          this.$nextTick(() => {
            let clientWidth = document.body.clientWidth;
            let clientHeight = document.body.clientHeight;
            let subframeH = (document.querySelector(".statistics-frame") as any)
              .offsetHeight;

            let staticFormH2 = (document.querySelector("#staticForm2") as any)
              .offsetHeight;

            let pagination = (document.querySelector("#pagination") as any)
              .offsetHeight;

            let offsetH = clientWidth < 2168 && clientHeight <= 1080 ? 28 : 0;
            this.tableHeight =
              subframeH - (staticFormH2 + offsetH + pagination + 30);

            console.log(this.tableHeight);
          });
        }
      }

      // this.tableHeight = clientWidth > 1366 ? 700 : 400;
    });
  }

  destroyed() {
    window.removeEventListener("resize", () => {});
  }

  objectSpanMethod({ row, column, rowIndex, columnIndex }: any) {
    if (this.formStatistics.type === "2") {
      if (columnIndex === 0) {
        if (row[row.cityName] === 0) {
          return {
            rowspan: row.rowCount,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }

  init() {
    map().then(() => {
      this.map = new (window as any).BMap.Map("map", {
        enableMapClick: false,
        minZoom: 8
      });
      this.map.clearOverlays(); // 去除地图标注
      this.map.centerAndZoom("广西", 8); // 设置中心点
      this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

      setTimeout(() => {
        this.map.setMapStyleV2({ styleJson: JSON.parse(styleJson) });
      }, 500);

      this.formHeatMap.date = [
        moment().format("YYYY-MM-DD") + " 00:00:00",
        moment().format("YYYY-MM-DD") + " 23:59:59"
      ];

      this.heatTips = "";

      this.setRegionBoundary();
      this.getHeatMap();
      this.getHeatList();
    });
  }
  createPoint(options: Point = {}) {
    const isPoint = options.lng && options.lat;
    const { lng, lat } = options;
    return isPoint ? new BMap.Point(lng, lat) : null;
  }
  setRegionBoundary() {
    const cities = [
      "南宁市",
      "柳州市",
      "桂林市",
      "梧州市",
      "北海市",
      "崇左市",
      "来宾市",
      "贺州市",
      "玉林市",
      "百色市",
      "河池市",
      "钦州市",
      "防城港市",
      "贵港市"
    ];
    const bdary = new BMap.Boundary();

    bdary.get("广西壮族自治区", (res: any) => {
      const pointArray: any[] = [];
      res.boundaries.forEach((bd: any) => {
        let ply = new BMap.Polyline(bd, {
          strokeColor: "#1A9FFA",
          strokeWeight: 3,
          enableMassClear: false
        });
        this.map.addOverlay(ply);
      });
    });

    cities.forEach(name => {
      bdary.get(name, (res: any) => {
        const pointArray: any[] = [];
        res.boundaries.forEach((bd: any) => {
          let ply = new BMap.Polyline(bd, {
            strokeColor: "#1A9FFA",
            strokeWeight: 1,
            enableMassClear: false
          });
          this.map.addOverlay(ply);
        });
      });
    });
  }
  addHeat(points: any[]) {
    const maxCount = max(points.map(p => p.count));
    const heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 20 });

    this.map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({ data: points, max: maxCount });
  }
  handleHeatDateChange(values: any[]) {
    this.getHeatMap();
  }
  handleHeatAreaChange() {
    this.getHeatMap();
  }
  handleTypeChange() {
    this.getHeatList();
  }
  handleStatisticsDateChange() {
    this.getHeatList();
  }
  onScreenChange(tab: string) {}
  getFormValue(data?: any) {
    this.formData.codeArr = Array.isArray(data?.codes)
      ? data.codes
      : this.formData.codeArr || [];
    this.formData.date = Array.isArray(data?.date)
      ? data.date
      : this.formData.date || [];
    let params = {
      ...this.formData,
      CityCode: this.formData.codeArr[0] ? this.formData.codeArr[0] : undefined,
      CountyCode: this.formData.codeArr[1]
        ? this.formData.codeArr[1]
        : undefined,
      WarningStartTime: this.formData.date
        ? moment(this.formData.date[0]).format("YYYY-MM-DD") + " 00:00:00"
        : undefined,
      WarningEndTime: this.formData.date
        ? moment(this.formData.date[1]).format("YYYY-MM-DD") + " 23:59:59"
        : undefined
    };
    return params;
  }
  handleSizeChange(pageSize: any) {
    this.formData.pageSize = pageSize;
    this.searchForm();
  }
  handleCurrentChange(page: any) {
    this.formData.page = page;
    this.searchForm();
  }
  searchForm(params?: any) {
    this.loading = true;
    Axios.get("/api/warningmessage/page", {
      params: this.getFormValue(params)
    })
      .then(res => {
        res.data.list.forEach((element: any) => {
          element.crateTime = moment(element.crateTime).format("YYYY-MM-DD");
        });
        this.formData.total = res.data.totalCount;

        this.tableData = res.data.list;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  reSetForm(isReload: boolean = true) {
    this.formData = {
      keyword: undefined,
      type: undefined,
      isSolveget: null,
      page: 1,
      pageSize: 10,
      total: 0
    };
    this.formStatistics = {
      type: "1",
      date: [
        moment().format("YYYY-MM-DD") + " 00:00:00",
        moment().format("YYYY-MM-DD") + " 23:59:59"
      ]
    };
    this.heatTips = "";
    if (isReload) {
      this.formData.codeArr = [];
      this.formData.date = [
        moment().format("YYYY-MM-DD") + " 00:00:00",
        moment().format("YYYY-MM-DD") + " 23:59:59"
      ];
      this.formHeatMap = {
        cityCode: "全部",
        date: [
          moment().format("YYYY-MM-DD") + " 00:00:00",
          moment().format("YYYY-MM-DD") + " 23:59:59"
        ]
      };
      this.searchForm();
    }
  }
  resetHeatForm() {
    this.formHeatMap = {
      cityCode: "全部",
      date: [
        moment().format("YYYY-MM-DD") + " 00:00:00",
        moment().format("YYYY-MM-DD") + " 23:59:59"
      ]
    };
    this.getHeatMap();
  }
  resetStatisticeForm() {
    this.formStatistics = {
      type: "1",
      date: [
        moment().format("YYYY-MM-DD") + " 00:00:00",
        moment().format("YYYY-MM-DD") + " 23:59:59"
      ]
    };
    this.getHeatList();
  }
  exportExcel() {
    Axios.get("/api/warningmessage/export", {
      params: { ...this.getFormValue() },
      responseType: "blob"
    })
      .then((res: any) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        let fileName = "火点信息导出.xlsx";
        if (window.navigator.msSaveBlob) {
          try {
            window.navigator.msSaveBlob(blob, fileName);
          } catch (e) {
            console.log(e);
          }
        } else {
          // 谷歌浏览器 创建a标签 添加download属性下载
          const a = window.document.createElement("a");
          a.href = href;
          a.target = "_blank";
          a.style.display = "none";
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  exportHeatExcel() {
    const url =
      this.formStatistics.type === "1"
        ? "/api/warningmessage/getcitystatisticsexport"
        : "/api/warningmessage/getcountystatisticsexport";
    Axios.get(url, {
      params: {
        startTime: this.formStatistics.date
          ? moment(this.formStatistics.date[0]).format("YYYY-MM-DD") +
            " 00:00:00"
          : undefined,
        endTime: this.formStatistics.date
          ? moment(this.formStatistics.date[1]).format("YYYY-MM-DD") +
            " 23:59:59"
          : undefined
      },
      responseType: "blob"
    })
      .then((res: any) => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        const currentDate = moment().format("YYYY年MM月DD日HH:mm:ss");
        let fileName =
          this.formStatistics.type === "1"
            ? `城市火点数据统计_${currentDate}.xlsx`
            : `区县火点数据统计_${currentDate}.xlsx`;
        if (window.navigator.msSaveBlob) {
          try {
            window.navigator.msSaveBlob(blob, fileName);
          } catch (e) {
            console.log(e);
          }
        } else {
          // 谷歌浏览器 创建a标签 添加download属性下载
          const a = window.document.createElement("a");
          a.href = href;
          a.target = "_blank";
          a.style.display = "none";
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  openImage(urls: any) {
    this.imgUrls = urls;
    this.dialogVisible = true;
  }

  warningtypeoptions: any[] = [];
  getWarningtypeoptions() {
    Axios.get("/api/warningmessage/warningtypeoptions").then(res => {
      this.warningtypeoptions = res.data;
    });
  }

  cityList: any[] = [];
  getTreeoptions() {
    Axios.get("/api/area/treeoptions", {
      params: { Level: 2, maxLevel: 3 }
    }).then(res => {
      res.data.unshift({
        value: "",
        label: "全部"
      });
      this.cityList = res.data;
    });
  }

  provinceList: any[] = [
    {
      value: "全部",
      label: "全部"
    }
  ];
  getOptionsBySpecificLevel() {
    Axios.get("/api/area/optionsbyspecificlevel", {
      params: { Level: 2, maxLevel: 2 }
    }).then(res => {
      res.data.unshift({
        value: "全部",
        label: "全部"
      });
      this.provinceList = res.data;
    });
  }

  heatMapPoints: any[] = [];
  getHeatMap() {
    Axios.get("/api/warningmessage/getheatmap", {
      params: {
        cityCode:
          this.formHeatMap.cityCode !== "全部"
            ? this.formHeatMap.cityCode
            : undefined,
        startTime: this.formHeatMap.date
          ? moment(this.formHeatMap.date[0]).format("YYYY-MM-DD") + " 00:00:00"
          : undefined,
        endTime: this.formHeatMap.date
          ? moment(this.formHeatMap.date[1]).format("YYYY-MM-DD") + " 23:59:59"
          : undefined
      }
    }).then(res => {
      this.heatMapPoints = res.data;
      const points = this.heatMapPoints.map(item =>
        this.createPoint({
          lng: item.lng,
          lat: item.lat
        })
      );
      this.map.clearOverlays();
      this.map.setViewport(points, {
        enableAnimation: true,
        zoom: 17
      });
      setTimeout(() => {
        this.addHeat(this.heatMapPoints);
      }, 500);
    });
  }

  heatList: any[] = [];
  heatTips: string = "";
  getHeatList() {
    this.loading = true;
    const url =
      this.formStatistics.type === "1"
        ? "/api/warningmessage/getcitystatistics"
        : "/api/warningmessage/getcountystatistics";
    Axios.get(url, {
      params: {
        startTime: this.formStatistics.date
          ? moment(this.formStatistics.date[0]).format("YYYY-MM-DD") +
            " 00:00:00"
          : undefined,
        endTime: this.formStatistics.date
          ? moment(this.formStatistics.date[1]).format("YYYY-MM-DD") +
            " 23:59:59"
          : undefined
      }
    })
      .then(res => {
        if (this.formStatistics.type === "1") {
          this.heatList = res.data.data;
        } else {
          const { data } = res.data;
          const flatMap: any[] = [];

          data.forEach((item: any) => {
            item.countyStatistics = item.countyStatistics.map(
              (n: any, i: number) => {
                return {
                  [item.cityName]: i,
                  rowCount: item.countyStatistics.length,
                  cityName: item.cityName,
                  name: n.name,
                  warningCount: n.warningCount,
                  solvegetCount: n.solvegetCount,
                  rate: !isEmpty(n.rate) ? n.rate : "—"
                };
              }
            );
            flatMap.push(...item.countyStatistics);
          });
          this.heatList = flatMap;
        }
        this.heatTips = res.data.tips;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  jumpToList(code: string) {
    this.activeName = "火点列表";
    this.reSetForm(false);
    this.searchForm({
      codes:
        this.formHeatMap.cityCode !== "全部"
          ? [this.formHeatMap.cityCode, code]
          : [code],
      date: this.formHeatMap.date
    });
  }
}
</script>

<style lang="scss">
@import "../../../styles/statistics-screen.scss";
.statistics-screen-3 {
  height: calc(100vh - 74.2px);

  /deep/ .el-form-item {
    margin-bottom: 0 !important;
  }

  .el-tabs {
    margin-left: 40px;
  }

  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__active-bar {
    height: 3px;
    background-color: #f2cb62;
  }

  .el-tabs__nav-wrap:after {
    background-color: transparent;
  }

  .el-tabs__item {
    height: 30px;
    line-height: 30px;
    color: #fff;
    font-weight: bold;
    font-size: 16px;

    &.is-active {
      color: #f2cb62;
    }
  }
  .statistics-frame {
    width: 100%;
    position: relative;
    margin-top: 12px;
    margin-left: 10px;
    margin-right: 10px;
    overflow: hidden;
    @include background-setting(
      "../../../assets/screen_images/img-bg01.png",
      100%,
      100%
    );
    height: calc((100%) - 12px);

    &__split {
      /deep/ .el-col {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("../../../assets/screen_images/img-bg01.png");
      }
    }

    .statistics-map {
      width: 100%;
      padding: 0 16px 0 16px;
      overflow: hidden;
      #map {
        height: calc((100vh) - 230px);
        border-radius: 12px;
        background-color: #0b131d !important;
      }

      &__list {
        width: 96%;
        margin: 0 18px;
      }
    }
    &_form {
      background-color: transparent;
      margin-top: 20px;
      margin-left: 20px;
      .el-form-item__label {
        color: #ffffff;
      }

      &.is-pdbless {
        /deep/ .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .el-table,
    .el-table th,
    .el-table tr {
      background-color: transparent;
      color: #ffffff;
    }
    .el-table__body tr:hover > td {
      background-color: #0a47a5 !important;
      // color: #000;
    }
  }

  .statistics-subframe {
    @include background-setting(
      "../../../assets/screen_images/img-bg01.png",
      100%,
      100%
    );
    height: calc((100vh) - 115px);
    overflow: hidden;

    .el-table th,
    .el-table td {
      padding: 10px 0;
    }
  }
  .el-pagination button:disabled,
  .el-pager li,
  .el-pagination .btn-prev,
  .el-pagination .btn-next,
  .el-pagination__total,
  .el-pagination span:not([class*="suffix"]),
  .el-pagination button,
  .el-range-input {
    background-color: transparent;
    color: #ffffff;
  }
  .el-pagination .active {
    color: #1890ff;
  }
  .el-date-editor .el-range__icon {
    color: #ffffff;
  }
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.3);
  }
  @media screen and (max-width: 1366px) {
    .el-form-item__content,
    .el-button--medium {
      height: 27px;
      font-size: 12px;
    }
    .el-button--medium {
      line-height: 0;
    }
  }
}

.statistics__subtitle {
  margin: 0;
  margin-bottom: 16px;
  font-size: 18px;
}

.statistics__tips {
  margin-left: 18px;
  margin-top: 16px;
}

.img-item {
  display: block;
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
}
</style>
