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
          <el-button type="primary" @click="AddUserFrame">添加用户</el-button>
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
            <!-- el-tooltip 标签进行悬停提示 -->
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
                @click="PutUserFrame(scope.row.id)"
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
                @click="DeleteUser(scope.row.id)"
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
                @click="RoleUserFrame(scope.row)"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="AddForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="PutDialogVisible"
      width="30%"
      @close="editFormClear"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="PutDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="RoleDialogVisible"
      width="30%"
      @close="roleFormClear"
    >
      <!-- @close="RoleFormClear" -->
      <!-- 
         :model="RoleForm"
        :rules="RoleRules"
        ref="RoleRef"
     -->
      <el-form label-width="100px" ref="RoleRef">
        <el-form-item label="用户名">
          <el-input v-model="rowData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input v-model="rowData.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="更换角色">
          <el-select v-model="selectedRoled" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="RoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="RoleUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VueProjectUsers',

  data() {
    // 自定义校验规则
    var checkEmail = (rule, value, cbk) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //  邮箱合法
        return cbk()
      }
      cbk(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cbk) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //  邮箱合法
        return cbk()
      }
      cbk(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      // 用户总数据条数
      total: 0,
      // 添加用户弹框是否打开
      AddDialogVisible: false,
      PutDialogVisible: false,
      RoleDialogVisible: false,
      // 接收修改用户信息时候发送请求拿到的数据
      editForm: {},
      // 接收分配角数据
      rolesList: [],
      // 存储当前行的数据
      rowData: {},
      // 选择的分配角色
      selectedRoled: '',
      // 添加用户的表单数据
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户的验证规则
      AddRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符 !!!',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符 !!!',
            trigger: 'blur',
          },
        ],
        email: [
          // 引入自定义校验规则
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 引入自定义校验规则
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //  { required: false, message: '请输入密码', trigger: 'blur' },
      // 修改用户信息验证规则
      editRules: {
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 引入自定义校验规则
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 引入自定义校验规则
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
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
      // console.log(res)
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
    // 监听状态改变
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
    // 显示添加用户弹框
    AddUserFrame() {
      this.AddDialogVisible = true
    },
    // 监听添加用户弹框是否关闭 只要关闭弹窗进行清除表单
    addFormClear() {
      // 将关闭后的表单清空
      this.$refs.AddFormRef.resetFields()
    },

    // 添加新用户
    AddUser() {
      // 进行表单验证 当所有项符合规则后才能发送请求
      // valid 返回布尔值 验证成功为true
      this.$refs.AddFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.AddForm)
        if (res.meta.status != 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 调用关闭添加用户对话框
        this.AddDialogVisible = false
        // 添加数据后重新进行渲染
        this.getUserList()
      })
    },
    //点击修改 弹出对话框 并渲染对应的数据
    async PutUserFrame(id) {
      //  点击修改弹出对话框
      this.PutDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // 赋值
      this.editForm = res.data
    },
    editFormClear() {
      // 将关闭后的表单清空
      this.$refs.editRef.resetFields()
    },
    // 确认修改用户信息
    EditUser() {
      this.$refs.editRef.validate(async (valid) => {
        if (!valid) return
        console.log(valid)

        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.$message.success('修改用户信息成功')
        this.PutDialogVisible = false
        this.getUserList()
      })
    },
    // 删除
    async DeleteUser(id) {
      const delyn = await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      if (delyn !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.getUserList()
        this.$message.success('已删除')
      }
    },
    // 分配角色对话框
    async RoleUserFrame(rowData) {
      this.RoleDialogVisible = true
      // 获取点击的当前行
      this.rowData = rowData
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色数据失败')
      this.rolesList = res.data

      console.log(this.rolesList)
    },
    // 关闭对话框进行清除
    roleFormClear() {
      // this.$refs.RoleRef.resetFields()
      this.selectedRoled = ' '
    },
    // 确认分配角色
    async RoleUser() {
      if (!this.selectedRoled) return this.$message.error('请选择角色')
      const { data: res } = await this.$http.put(
        'users/' + this.rowData.id + '/role',
        {
          rid: this.selectedRoled,
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更换角色失败')

      // 关闭对话框
      this.RoleDialogVisible = false
      // 重新渲染数据
      this.getUserList()
      this.$message.success('更换角色成功')
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
