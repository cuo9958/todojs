const Router = require("koa-router");
const TaskModel = require("../models/tasks");
const SDK = require("fe_user_sdk/dist/koa");

const router = new Router();

const valide = SDK.simple(ctx => {
    ctx.body = {
        code: 0,
        msg: "请登录"
    };
});

router.all("/", function(ctx, next) {
    ctx.body = "不存在的接口";
});

router.get("/list", async function(ctx, next) {
    const { pageIndex, title } = ctx.query;
    const username = ctx.headers.username;
    try {
        const data = await TaskModel.getCount(pageIndex, title, username);
        ctx.body = {
            code: 1,
            data
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
router.get("/detail", async function(ctx, next) {
    const { id } = ctx.query;
    try {
        const data = await TaskModel.get(id);
        ctx.body = {
            code: 1,
            data
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
router.post("/detail", valide, async function(ctx, next) {
    const { id, title, last_date, last_time, to_type, to_count, tell, isAll } = ctx.request.body;
    const username = ctx.headers.username;

    try {
        const model = {
            title,
            username,
            last_date,
            last_time,
            to_type,
            tell,
            to_count,
            is_all: isAll === "true" ? 1 : 0
        };
        if (id && id > 0) {
            await TaskModel.update(model, id);
        } else {
            model.status = 1;
            await TaskModel.insert(model);
        }
        ctx.body = {
            code: 1
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
router.post("/status", async function(ctx, next) {
    const { id, status } = ctx.request.body;
    try {
        const model = {
            status
        };
        await TaskModel.update(model, id);
        ctx.body = {
            code: 1
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
router.post("/del", async function(ctx, next) {
    const { id } = ctx.request.body;
    const username = ctx.headers.username;
    try {
        await TaskModel.del(id, username);
        ctx.body = {
            code: 1
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message
        };
    }
});
exports.routers = router.routes();
