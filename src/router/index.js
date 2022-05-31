import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'
import Goods from '../components/goods/Goods.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Orders from '../components/order/Orders.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        // 权限管理
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        // 商品管理
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/params',
          component: Params
        },
        // 订单管理
        {
          path: '/orders',
          component: Orders
        },
      
      ]
    }
  ]
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行  next()放行 next('/login')强值跳转
  // 如果访问的是登录页面直接放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // token 不存在直接跳转到login页
  if (!tokenStr) return next('/login');
  next();
})

export default router;