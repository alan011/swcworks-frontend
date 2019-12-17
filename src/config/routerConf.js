const First = { template: '<div><h2>我是第 1 个子页面</h2></div>' }
const Second = { template: '<div><h2>我是第 2 个子页面</h2></div>' }

const Router = [
    {
      path: '/first',
      component: First
    },
    {
      path: '/second',
      component: Second
    },
    {
      path: '/third',
      component: () => import('$views/routers/third')
    },
    {
      path: '/zhengcechuangzhi',
      component: () => import('$views/routers/zhengcechuangzhi.vue')
    },
    // {
    //   path: '/xingzhengjigou',
    //   component: () => import('$views/routers/xingzhengjigou.vue')
    // },
    {
      path: '/mingzhenggangweikaifa',
      component: () => import('$views/routers/t2_minzheng_gangweikaifa.vue')
    },
    {
      path: '/gangwei',
      component: () => import('$views/routers/gangwei.vue')
    },
    {
      path: '/rencaiziyuan',
      component: () => import('$views/routers/rencaiziyuan.vue')
    },
    {
      path: '/rencaipeixun',
      component: () => import('$views/routers/rencaipeixun.vue')
    },
    {
      path: '/hangyexiehui',
      component: () => import('$views/routers/hangyexiehui.vue')
    },
    {
      path: '/minbanjigou',
      component: () => import('$views/routers/minbanjigou.vue')
    },
    {
      path: '/zijintouru',
      component: () => import('$views/routers/zijintouru.vue')
    },
    {
      path: '/shehuishidian',
      component: () => import('$views/routers/shehuishidian.vue')
    },
    {
      path: '/zyfwzhengce',
      component: () => import('$views/routers/shehuishidian.vue')
    },
    {
      path: '/zyfwzuzhi',
      component: () => import('$views/routers/zyfwzuzhi.vue')
    },
    {
      path: '/zyzzhuce',
      component: () => import('$views/routers/zyzzhuce.vue')
    },
    {
      path: '/zyzpeixun',
      component: () => import('$views/routers/zyzpeixun.vue')
    },
    {
      path: '/jilugongzuo',
      component: () => import('$views/routers/jilugongzuo.vue')
    },
    {
      path: '/huodongkaizhan',
      component: () => import('$views/routers/huodongkaizhan.vue')
    },
    {
      path: '/jilibaozhang',
      component: () => import('$views/routers/jilibaozhang.vue')
    },
    {
      path: '/zyfwzijin',
      component: () => import('$views/routers/zyfwzijin.vue')
    },
    {
      path: '/',
      redirect: '/zhengcechuangzhi' 
    }
  ]

  export default Router;