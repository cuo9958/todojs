const Router = require("koa-router");

const router = new Router();

router.post("/", function(ctx, next) {
    ctx.body = "不存在的接口";
});

exports.routers = router.routes();

//
