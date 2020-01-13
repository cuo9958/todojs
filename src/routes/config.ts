import Tasks from "../pages/tasks/index";
import Err404 from "../pages/404/index";

export default [
    {
        /**
         * 页面名,菜单命中
         */
        name: "Tasks",
        /**
         * 显示名称
         */
        title: "任务列表",
        /**
         * icon图标
         */
        icon: "fa fa-dashboard",
        /**
         * url路径
         */
        path: "/",
        /**
         * 页面组件
         */
        page: Tasks,
        /**
         * 是否强制匹配
         */
        exact: true,
        /**
         * 是否隐藏外层视图
         */
        hideLayout: false,
        /**
         * 是否不在菜单展示
         */
        hide: false
    },
    //任务列表
    // { name: 'Tasks', title: '任务列表', icon: 'fa fa-ship', path: '/tasks', page: Tasks, exact: true },
    { name: "404", path: "*", page: Err404, exact: true, hide: true }
];
