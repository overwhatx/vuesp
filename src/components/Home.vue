<template>
  <el-container class="container_box">
    <el-header>
      <div class="hed_lef">
        <img src="../assets/cloud.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menucollapsetf ? '64px' : '200px'">
        <div class="toggle_button flag" @click="menucollapse">
          <i class="el-icon-arrow-left"></i>
          <i class="iconfont icon-shuxian"></i>
          <i class="el-icon-arrow-right"></i>
        </div>

        <!-- 
            active-text-color	当前激活菜单的文字颜色
            default-active	当前激活菜单的 index
            unique-opened	是否只保持一个子菜单的展开
            collapse	是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
            collapse-transition	是否开启折叠动画
            default-active	当前激活菜单的 index
            router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
         -->
        <el-menu
          background-color="#01081f"
          text-color="#fff"
          active-text-color="#3d7eff"
          unique-opened
          :collapse="menucollapsetf"
          collapse-transition
          router
          :default-active="activePath"
        >
          <!-- 一级导航 -->
          <!-- 需要唯一的index值否则会导致联动 只接收字符串所以拼接 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuicon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级导航 -->
            <!-- itemchild.path 获取到对应访问路径 通过饿了么的router组件配合使用  -->
            <el-menu-item
              :index="'/' + itemchild.path"
              v-for="itemchild in item.children"
              :key="itemchild.id"
            >
            <!-- @click="menuColor('/' + itemchild.path)" -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemchild.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      menuicon: {
        125: 'iconfont icon-yonghu',
        103: 'iconfont icon-fenbushi',
        101: 'iconfont icon-gouwuche',
        102: 'iconfont icon-dingdan',
        145: 'iconfont icon-shuju',
      },
      //   侧边栏是否折叠默认不折叠
      menucollapsetf: false,
      activePath: '',
    }
  },
  created() {
    //生命周期
    this.getMenuList()
    // 创建的时候就调用获取到 path值
    // this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    quit() {
      this.$confirm('即将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!',
          })
          //   退出将 清除所有token值
          window.sessionStorage.clear()
          //   页面进行跳转
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    // 获取所有侧边栏菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      //   如果状态不等于200 表示错误 返回后台给的错误提示
      if (res.meta.status !== 200) return this.$message.err(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    // 点击按钮切换侧边栏状态
    menucollapse() {
      this.menucollapsetf = !this.menucollapsetf
    },
    // 点击按钮的时候 保存当前url 获取到path值 并进行赋值
    // menuColor() {
      //   window.sessionStorage.setItem('activePath', activePath)
      //   this.activePath = activePath
      //   this.activePath = window.location.hash.slice(1)
      //   console.log(window.location.hash)
    // },
  },
  watch: {
    $route(to, from) {
      console.log(to.path, from)
      this.activePath = to.path
    },
  },
}
</script>

<style lang="less" scoped>
.container_box {
  height: 100%;
  .el-header {
    background: #01081f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .hed_lef {
      display: flex;
      img {
        width: 60px;
      }
      span {
        font-size: 26px;
        color: #ffffff;
        line-height: 60px;
      }
    }
  }

  .el-aside {
    background: #01081f;
  }
  .el-main {
    background-color: #041139;
  }
  .el-footer {
    background: #01081f;
  }
}
.el-menu {
  border: none;
}
/deep/ .el-submenu__title i {
  color: #ffffff;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  padding: 10px 0;
  background-color: #012b41;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .iconfont {
    font-size: 20px;
    margin: 0;
  }
  cursor: pointer;
}
.toggle_button.flag:hover {
  color: #3d7eff;
}
.el-aside {
  transition: all 1s;
  overflow: visible;
}
</style>
