<template>
  <div class="tpoContent">
    <el-row :gutter="20">
      <el-col :span="7" class="tpoContent_item">
        <!-- 原始：color:#d85965; -->
        <div class="tpoContent_item_text" style="color:#E22547">
          {{ warnCount }}
        </div>
        <div style="font-size: 12px;">当日火点总数</div>
      </el-col>
      <el-col :span="7" class="tpoContent_item">
        <div class="tpoContent_item_text" style="color:#d3d531;">
          {{ doneCount }}
        </div>
        <div style="font-size: 12px;">当日处理总数</div>
      </el-col>
      <el-col :span="7" class="tpoContent_item">
        <div class="tpoContent_item_text" style="color:#07b8c5;">
          {{ pointCount }}
        </div>
        <div style="font-size: 12px;">监控点位总数</div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "BdMapTop"
})
export default class extends Vue {
  @Prop({ default: 0 }) private pointCount!: number;
  @Prop({ default: 0 }) private warnCount!: number;
  @Prop({ default: 0 }) private doneCount!: number;
}
</script>

<style>
.tpoContent {
  position: absolute;
  width: 450px;
  /* height: 200px; */
  /* background: #ffffff; */
  text-align: center;

  left: 50%;
  top: 53px;
  transform: translate(-50%, -50%);
}

.tpoContent_item {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url("../../../../assets/screen_images/img-bg01.2e383400.png");
  padding: 10px 20px;
  margin: 0 8px;
}
.tpoContent_item_text {
  font-size: 24px;
  margin: 5px 0;
}

@media screen and (max-width: 1366px) {
  .tpoContent {
    font-size: 14px;
  }
  .tpoContent_item_text {
    font-size: 24px;
    margin: 5px 0;
  }
}
</style>
