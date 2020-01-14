/**
 * 默认配置
 */

module.exports = {
    name: "服务",
    //开发环境数据库
    db: {
        host: "10.14.108.89",
        port: "3306",
        database: "fe_todo",
        user: "fe_todo",
        password: "zBREYYckrMsEZtcH",
        connectionLimit: 2
    },
    //开发环境，普通redis配置
    redis: "redis://10.14.108.89:6379",
    dingding: {
        preTxt: "!!",
        url: "https://oapi.dingtalk.com/robot/send?access_token=a1d82d8627a7887cc7586d404f528f1d3151251f21f76961bc896193edf1c731"
    }
};
