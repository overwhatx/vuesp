<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- v-loading="!userList.length" -->
      <el-table
        :data="rights"
        :stripe="true"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      > 
     
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="权限说明" prop="authName"> </el-table-column>
        <el-table-column label="权限父 ID" prop="pid"> </el-table-column>
        <el-table-column label="对应访问路径" prop="path"> </el-table-column>
        <el-table-column label="权限层级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'VueProjectAdd',

  data() {
    return {
      // 接收权限列表
      rights: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    //   获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200)
        return this.$message.error('获取权限列表失败')
      this.rights = res.data
    },
  },
}
</script>

<style lang="scss" scoped></style>
