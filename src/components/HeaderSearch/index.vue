<template>
  <div
    id="header-search"
    :class="{'show': show}"
    class="header-search"
  >
    <svg-icon
      class="search-icon"
      name="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.meta.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import path from 'path'
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'HeaderSearch'
})
export default class extends Vue {
  private search = ''
  private show = false
  private options: RouteConfig[] = []
  private searchPool: RouteConfig[] = []
  private fuse?: Fuse<RouteConfig, Fuse.IFuseOptions<RouteConfig>>

  get routes() {
    return PermissionModule.routes
  }




  @Watch('routes')
  private onRoutesChange() {
  }


  @Watch('show')
  private onShowChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.close)
    } else {
      document.body.removeEventListener('click', this.close)
    }
  }

  mounted() {
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  private change(route: RouteConfig) {
    this.$router.push(route.path)
    this.search = ''
    this.options = []
    this.$nextTick(() => {
      this.show = false
    })
  }

  private initFuse(list: RouteConfig[]) {
    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [{
        name: 'title',
        weight: 0.7
      }, {
        name: 'path',
        weight: 0.3
      }]
    })
  }


  private querySearch(query: string) {
    if (query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query).map((result) => result.item)
      }
    } else {
      this.options = []
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
