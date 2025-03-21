import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace, State } from "vuex-class";
const appModule = namespace("app");
const WIDTH = 992 // refer to Bootstrap's responsive design

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  @appModule.State("sidebar")
  sidebar: any;
  get device() {
    return false
  }

  // get sidebar() {
  //   return AppModule.sidebar
  // }

  @Watch('$route')
  private onRouteChange() {
    // if (this.device === DeviceType.Mobile && this.sidebar.opened) {
      // AppModule.CloseSideBar(false)
    // }
  }

  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  }

  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) {
      // AppModule.ToggleDevice(DeviceType.Mobile)
      // AppModule.CloseSideBar(true)
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  private isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  private resizeHandler() {
    if (!document.hidden) {
      const isMobile = this.isMobile()
      // AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)
      // if (isMobile) {
      //   AppModule.CloseSideBar(true)
      // }
    }
  }
}
