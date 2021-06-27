import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const commonRoutes = [
  {
    path: "/login",
    name: "login",
    meta: { title: "login" },
    component: () => import("../components/Login.vue")
  },
  {
    path: "/other", // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
    name: "other",
    meta: { title: "other" },
    component: () => import("../views/Other.vue")
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "404" },
    component: () => import("../components/404.vue")
  },
  { path: "/", redirect: "/home" }
];

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
  home: {
    path: "home",
    name: "home",
    meta: { title: "homepage" },
    component: () => import("../views/Home.vue")
  },
  t1: {
    path: "t1",
    name: "t1",
    meta: { title: "table" },
    component: () => import("../views/T1.vue")
  },
  password: {
    path: "password",
    name: "password",
    meta: { title: "change password" },
    component: () => import("../views/Password.vue")
  },
  msg: {
    path: "msg",
    name: "msg",
    meta: { title: "messages" },
    component: () => import("../views/Msg.vue")
  },
  userinfo: {
    path: "userinfo",
    name: "userinfo",
    meta: { title: "user info" },
    component: () => import("../views/UserInfo.vue")
  },
  question: {
    path: "question",
    name: "question",
    meta: { title: "Edit Qestion" },
    component: () => import("../views/Question.vue")
  },
  questiontype: {
    path: "questiontype",
    name: "questiontype",
    meta: { title: "Edit QestionType" },
    component: () => import("../views/QuestionType.vue")
  }
};

const createRouter = () =>
  new Router({
    routes: commonRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
