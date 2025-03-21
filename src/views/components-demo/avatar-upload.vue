<template>
  <div class="components-container">
    <aside>
      This is based on
      <a
        class="link-type"
        href="//github.com/dai-siki/vue-image-crop-upload"
      >
        vue-image-crop-upload
      </a>
    </aside>
    <pan-thumb :image="image" />
    <el-button
      type="primary"
      icon="el-icon-upload"
      tyle="position: absolute;bottom: 15px;margin-left: 40px;"
      @click="toggleShow"
    >
      Change Avatar
    </el-button>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PanThumb from '@/components/PanThumb/index.vue'

@Component({
  name: 'AvatarUploadDemo',
  components: {
    PanThumb
  }
})
export default class extends Vue {
  private showImageUpload = false
  private image = 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
  private params = { someParams: 'your_params_goes_here' }
  private headers = { smail: '*_~' }

  private toggleShow() {
    this.showImageUpload = !this.showImageUpload
  }

  private onCropUploadSuccess(jsonData: any, field: string) {
    this.showImageUpload = false
    this.image = jsonData.files[field]
  }

  private onClose() {
    this.showImageUpload = false
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
