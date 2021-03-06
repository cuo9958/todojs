const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../db/mysql");

const Tasks = db.define(
    "t_tasks",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(100),
            defaultValue: "",
            comment: "任务标题"
        },
        last_date: {
            type: Sequelize.STRING(50),
            defaultValue: "",
            comment: "日期"
        },
        last_time: {
            type: Sequelize.STRING(20),
            defaultValue: "",
            comment: "时间"
        },
        to_count: {
            type: Sequelize.TINYINT,
            defaultValue: 1,
            comment: "重复次数"
        },
        to_type: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "重要程度"
        },
        is_all: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "状态;0:不是所有;1:所有"
        },
        tell: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "任务标题"
        },
        username: {
            type: Sequelize.STRING(50),
            defaultValue: "",
            comment: "用户名"
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "状态;0:失效;1:使用"
        }
    },
    {
        freezeTableName: true
    }
);

//强制初始化数据库
// Tasks.sync({ force: true });

module.exports = {
    insert: function(model) {
        return Tasks.create(model);
    },
    get: function(id) {
        return Tasks.findOne({
            where: {
                id
            }
        });
    },
    getCount(limit = 1, title, username = "") {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [["createdAt", "desc"]],
            attributes: ["id", "title", "last_date", "last_time", "to_type", "to_count", "status"],
            where: {
                username
            }
        };
        if (title) {
            config.where.title = {
                [Op.like]: "%" + title + "%"
            };
        }

        return Tasks.findAndCountAll(config);
    },
    update: function(model, id) {
        return Tasks.update(model, {
            where: {
                id
            }
        });
    },
    del: function(id, username) {
        return Tasks.findOne({
            where: { id, username }
        }).then(function(res) {
            return res.destroy();
        });
    },
    search(last_date, last_time) {
        let config = {
            order: [["id", "desc"]],
            attributes: ["id", "title", "to_type", "to_count", "tell", "is_all"],
            where: {
                last_date,
                last_time,
                status: 1
            }
        };
        return Tasks.findAll(config);
    }
};
