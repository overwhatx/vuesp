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
        <el-table-column type="expand">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <!--<pre>元素表示预先格式化的文本，该文本将完全按照 HTML 文件中所写的方式呈现-->
            <!--<pre>-->
            <!--{{ scope.row }}-->
            <!--</pre>-->
            <el-row
              v-for="(item, i1) in scope.row.children"
              :key="item.id"
              :class="['bd-bottom', i1 === 0 ? 'bd-top' : '', 'vcenter']"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--  通过for循环, 嵌套渲染二级权限 -->
                <el-row
                  v-for="(subItem, i2) in item.children"
                  :key="subItem.id"
                  :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, subItem.id)"
                    >
                      {{ subItem.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in subItem.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
                @click="showRight(scope.row)"
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

    <!--权限管理  -->
    <el-dialog
      title="权限管理"
      :visible.sync="showJurisdiction"
      width="30%"
      @close="closeRight"
    >
      <!-- 树形组件  -->
      <!-- :data="showList 数据源 -->
      <!-- :props="treeProps" 数据结构 -->
      <!-- show-checkbox 选框  node-key 唯一标识  default-expand-all 展开所有节点-->
      <el-tree
        :data="showList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showJurisdiction = false">取 消</el-button>
        <el-button type="primary" @click="allRight">确 定</el-button>
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
      // 控制权限管理的对话框
      showJurisdiction: false,
      // 接收所有权限树形列表
      showList: [],
      // 树形列表的数据配置
      treeProps: {
        children: 'children', //以什么作为嵌套
        label: 'authName', //展示的数据
      },
      // 已有的权限
      defKeys: [],
      // 当前行的id
      roleId: '',
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
    // 根据id查询当前数据是否存在 并进行赋值 渲染到修改的表单
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
    // 根据id 删除权限
    async removeRightById(role, rightId) {
      const result = await this.$confirm('删除当前权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (result !== 'confirm') {
        return this.$message.error('取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // 删除成功后重新渲染 会导致整个页面的刷新 并关闭操作
      // this.getRoles()
      // 通过接口 当删除后会返回最新的权限 所以直接将新的权限进行渲染
      role.children = res.data
    },
    // 权限设置
    async showRight(role) {
      // 获取当前点击的 id
      this.roleId = role.id
      // 获取到所有权限 并赋值
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) return this.$message.error('获取权限失败')
      // 获取权限成功 进行赋值
      this.showList = res.data
      console.log(this.showList)

      // 递归获取三级节点的id
      this.getRight(role, this.defKeys)

      this.showJurisdiction = true
    },
    // 获取当前角色的所有权限
    getRight(node, arr) {
      // 只获取三级节点的 id 底部的选中了 顶部的会自动勾选
      // 判断当前 node节点中 不包含 children 属性 既为三级节点
      if (!node.children) return arr.push(node.id)
      node.children.forEach((item) => {
        this.getRight(item, arr)
      })
    },
    // 监听 权限分配的关闭 清除上一次留下的数据
    closeRight() {
      this.defKeys = []
    },
    // 确认权限
    async allRight() {
      const keys = [
        // 返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 返回目前半选中的节点所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const strKeys = keys.join(',')
      console.log(strKeys)

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: strKeys,
        }
      )
      if (res.meta.status != 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      // 重新渲染
      this.getRoles()
      //  关闭对话框
      this.showJurisdiction = false
    },
  },
}
</script>

<style lang="less" scoped>
.topadd {
  margin-bottom: 15px;
}
.bd-top {
  border-top: 1px solid #eeeeee;
}
.bd-bottom {
  border-bottom: 1px solid #eeeeee;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
