<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-button type="primary" @click="addRoleFrame" class="topadd"
        >添加角色</el-button
      >
      <!-- v-loading="!userList.length" -->
      <el-table
        :data="roles"
        :stripe="true"
        border
        element-loading-text="拼命加载中"
        style="width: 100%"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <!-- el-tooltip 标签进行悬停提示 -->
            <el-tooltip
              :enterable="false"
              class="item"
              content="修改角色"
              effect="dark"
              placement="top"
            >
              <el-button
                icon="iconfont icon-bianji"
                size="mini"
                type="primary"
                @click="editRolesData(scope.row.id)"
              >
                <!-- editRolesData(scope.row.id) 点击的当前数据 获取当前行的id 用于判断数据库中是否存在 -->
              </el-button>
            </el-tooltip>

            <!-- 删除按钮-->
            <el-tooltip
              :enterable="false"
              class="item"
              content="删除角色"
              effect="dark"
              placement="top"
            >
              <el-button
                icon="iconfont icon-shanchu"
                size="mini"
                type="danger"
                @click="deleteRoles(scope.row.id)"
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
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加新用户"
      :visible.sync="AddDialogVisible"
      width="30%"
      @close="addFormClear"
    >
      <el-form
        :model="AddForm"
        :rules="AddRules"
        ref="AddFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="添加新用户" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VueProjectAdd',

  data() {
    return {
      // 接收角色数据
      roles: [],
      //   添加对话框
      AddDialogVisible: false,
      //   双向绑定表单数据
      AddForm: {
        roleName: '',
        roleDesc: '',
      },
      //   添加角色验证规则
      AddRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //   修改的对话框
      editDialogVisible: false,
      //  修改的值 接收通过id判断是否存在的的数据
      editForm: {},
    }
  },
  created() {
    //   通过生命周期 在创建的时候就进行调用 角色列表数据并渲染
    this.getRoles()
  },
  methods: {
    //   渲染角色数据
    async getRoles() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.roles = res.data
    },
    // 点击添加弹出对话框
    addRoleFrame() {
      this.AddDialogVisible = true
    },
    // 确认添加角色
    addRole() {
      // 当表单验证都通过才发送请求 否则直接退出
      this.$refs.AddFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', {
          roleName: this.AddForm.roleName,
          roleDesc: this.AddForm.roleDesc,
        })
        console.log(res.data)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        // 关闭对话框
        this.AddDialogVisible = false
        // 重新渲染数据
        this.getRoles()
        this.$message.success('添加角色成功')
      })
    },
    // 关闭对话框清除表单数据
    addFormClear() {
      this.$refs.AddFormRef.resetFields()
    },
    // 更具id查询当前数据是否存在 并进行赋值 渲染到修改的表单
    async editRolesData(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 修改角色
    async editRole() {
      // 进行校验表单是否全通过
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        // 关闭对话框
        this.editDialogVisible = false
        // 重新渲染数据
        this.getRoles()
        this.$message.success('修改角色成功')
      })
    },
    // 删除角色
    async deleteRoles(id) {
      const delyn = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      if (delyn !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.$message.success('删除角色成功')
        //   重新渲染
        this.getRoles()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.topadd {
  margin-bottom: 15px;
}
</style>
