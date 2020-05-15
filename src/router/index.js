import Vue from "vue";
import Router from "vue-router";
// import Func from '@/views/func/Func.vue';
// 1、require.ensure()实现按需加载
// require.ensuire(dependencies:String[],callback:function(require),errorCallback:function(error),chunkName:String)
// const List = resolve =>{ require.ensure([],()=>{ resolve(require('./list')) },'list') }
// 2、异步组件技术
// resove => require(['@/components/home'],resolve)
// 3、使用动态的import()语法
// //没有指定webpackChunkName,每个组件打包成一个js文件
// const test1 = ()=>import('@/components/test1.vue')
// const test2 = ()=>import('@/components/test2.vue')
// //指定了相同的webpackChunkName，会合并打包成y一个js文件
// const test3 = ()=>import(/* webpackChunkName:'grounpTest' */ '@/components/test3.vue')
// const test4 = ()=>import(/* webpackChunkName:'grounpTest' */ '@/components/test4.vue')

Vue.use(Router);

export const appRouter = [
    {
        path: "*",
        redirect: "/login"
    },
    {
        path: "/login",
        name: "login",
        component: resolve => {
            require(["@/views/login/login.vue"], resolve);
        }
    }
];

let route = new Router({
    mode: "history",
    routes: appRouter
});

/* route.beforeEach((to, from, next) => {
    if (to.path !== '/login' && !auth.isLogin()) {
        next('/login');
    } else {
        next();
    }
}); */

export default route;
