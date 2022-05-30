<template>
  <div id="login_box">
    <div class="login_main">
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="loginRules"
        ref="formRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="formRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //   表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //   点击重置按钮 重置所有表单 和去除提示
    formRef() {
      this.$refs.formRef.resetFields()
    },
    //   登录进行校验
    login() {
      console.log(this.loginForm);
      this.$refs.formRef.validate(async (valid) => {
        console.log(valid) //返回 true 或false
        if (!valid) return //当为false 时直接退出
        // 发送post 请求 并携带用户名和密码参数
        // 解构出data 只 获取到返回的data数据 简化操作
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status != 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
#login_box {
  background-color: lightblue;
  height: 100%;
  .login_main {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>