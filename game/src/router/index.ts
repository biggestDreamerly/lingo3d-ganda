import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'


/**
 * 定义路由模块
 * 2022年2月28日21:41:54
 * CL
 */
const routes: Array<any> = [
    {
        path: '/',
        name: 'Lggin',
        component: import('../sence/login.vue'),
    },
    {
        path: '/game',
        name: 'game',
        component: import('../sence/index1.vue')
    }
]

/**
 * 定义返回模块
 */
const router = createRouter({
    history: createWebHistory('/'),  // 设置为history模式，就是路径里面没有#,  createWebHashHistory 是默认的，括号里面的就是基础路径，可以理解为项目名称，就是请求路径的基础url
    routes
})

export default router
