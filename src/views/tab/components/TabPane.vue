<template>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column
            v-loading="loading"
            align="center"
            label="ID"
            width="65"
            element-loading-text="请给我点时间！"
        >
            <template slot-scope="{row}">
                <span>{{ row.id }}</span>
            </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="Date">
            <template slot-scope="{row}">
                <span>{{ row.timestamp | parseTime }}</span>
            </template>
        </el-table-column>

        <el-table-column min-width="240px" label="Title">
            <template slot-scope="{row}">
                <span>{{ row.title }}</span>
                <el-tag>{{ row.type }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="Author">
            <template slot-scope="{row}">
                <span>{{ row.author }}</span>
            </template>
        </el-table-column>

        <el-table-column width="120px" label="Importance">
            <template slot-scope="{row}">
                <svg-icon v-for="n in +row.importance" :key="n" name="star" />
            </template>
        </el-table-column>

        <el-table-column align="center" label="Readings" width="95">
            <template slot-scope="{row}">
                <span>{{ row.pageviews }}</span>
            </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="Status" width="110">
            <template slot-scope="{row}">
                <el-tag :type="row.status | articleStatusFilter">{{ row.status }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    name: "TabPane",
})
export default class extends Vue {
    @Prop({ default: "CN" }) private type!: string;

    private list = null;
    private listQuery = {
        page: 1,
        limit: 5,
        type: this.type,
        sort: "id",
    };

    private loading = false;
}
</script>
