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
    redis: "redis://10.14.108.89:6379"
};
