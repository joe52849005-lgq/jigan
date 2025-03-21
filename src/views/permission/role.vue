<template>
  <div class="app-container">
    <el-button
      type="primary"
      @click="handleCreateRole"
    >
      {{ $t('permission.createRole') }}
    </el-button>

    <el-table
      :data="rolesList"
      style="width: 100%;margin-top:30px;"
      border
    >
      <el-table-column
        align="center"
        label="Role Key"
        width="220"
      >
        <template slot-scope="{row}">
          {{ row.key }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Role Name"
        width="220"
      >
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column
        align="header-center"
        label="Description"
      >
        <template slot-scope="{row}">
          {{ row.description }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Operations"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'Edit Role':'New Role'"
    >
      <el-form
        :model="role"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="Name">
          <el-input
            v-model="role.name"
            placeholder="Role Name"
          />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesTreeData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { Tree } from 'element-ui'

interface IRole {
  key: number
  name: string
  description: string
  routes: RouteConfig[]
}

interface IRoutesTreeData {
  children: IRoutesTreeData[]
  title: string
  path: string
}

const defaultRole: IRole = {
  key: 0,
  name: '',
  description: '',
  routes: []
}

@Component({
  name: 'RolePermission'
})
export default class extends Vue {
  private role = Object.assign({}, defaultRole)
  private reshapedRoutes: RouteConfig[] = []
  private serviceRoutes: RouteConfig[] = []
  private rolesList: IRole[] = []
  private dialogVisible = false
  private dialogType = 'new'
  private checkStrictly = false
  private defaultProps = {
    children: 'children',
    label: 'title'
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
