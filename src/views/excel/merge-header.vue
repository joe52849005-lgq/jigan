<template>
  <div class="app-container">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom:20px"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >
      {{ $t('excel.export') }}
    </el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="Id"
        width="95"
      >
        <template slot-scope="{$index}">
          {{ $index }}
        </template>
      </el-table-column>
      <el-table-column
        label="Main Information"
        align="center"
      >
        <el-table-column label="Title">
          <template slot-scope="{row}">
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column
          label="Author"
          align="center"
          width="180"
        >
          <template slot-scope="{row}">
            <el-tag>{{ row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Readings"
          align="center"
          width="115"
        >
          <template slot-scope="{row}">
            {{ row.pageviews }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="Date"
        width="220"
      >
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IArticleData } from '@/api/types'
import { formatJson } from '@/utils'
import { exportJson2Excel } from '@/utils/excel'

@Component({
  name: 'MergeHeader'
})
export default class extends Vue {
  private list: IArticleData[] = []
  private listLoading = true
  private downloadLoading = false

  created() {
  }


  private handleDownload() {
    this.downloadLoading = true
    const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
    const header = ['', 'Title', 'Author', 'Readings', '']
    const filterVal = ['id', 'title', 'author', 'pageviews', 'timestamp']
    const list = this.list
    const data = formatJson(filterVal, list)
    const merges = ['A1:A2', 'B1:D1', 'E1:E2']
    exportJson2Excel(header, data, 'merge-header', multiHeader, merges)
    this.downloadLoading = false
  }
}
</script>
