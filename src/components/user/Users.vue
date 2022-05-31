<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索和添加用户 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6" align>
          <el-button type="primary" @click="AddUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!--  用户列表-->
      <el-table
        v-loading="!userList.length"
        :data="userList"
        :stripe="true"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="用户名" prop="username"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>

        <el-table-column label="状态">
          <!-- 作用域插槽渲染状态这一列 -->
          <template slot-scope="scope">
            <!-- {{ scope.$index }} 下标-->
            <!-- {{ scope.column }} 当前行的所有数据-->
            <!-- {{ scope.row.mg_state }} 得到 当前行的true或false-->

            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              :enterable="false"
              class="item"
              content="修改用户"
              effect="dark"
              placement="top"
            >
              <el-button
                icon="iconfont icon-bianji"
                size="mini"
                type="primary"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮-->
            <el-tooltip
              :enterable="false"
              class="item"
              content="删除用户"
              effect="dark"
              placement="top"
            >
              <el-button
                icon="iconfont icon-shanchu"
                size="mini"
                type="danger"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色按钮-->
            <el-tooltip
              :enterable="false"
              class="item"
              content="分配角色"
              effect="dark"
              placement="top"
            >
              <el-button
                icon="iconfont icon-zuzhijiagou"
                size="mini"
                type="warning"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="this.queryInfo.pagesize"
        :page-sizes="[2, 4, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
  </div>
</template>

<script>
export default {
  name: 'VueProjectUsers',

  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //   获取用户数据
    async getUserList() {
      this.loading = true
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.loading = false
      console.log(res)
    },
    // size-change	pageSize 改变时会触发
    handleSizeChange(newSize) {
      //   改变每页条数
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // currentPage 改变时会触发	当前页
    handleCurrentChange(newPage) {
      // 改变当前位于页
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 状态改变
    async userStateChanged(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },
    AddUser() {
      console.log(1)
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
