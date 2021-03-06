const Koa = require("koa");
const Router = require("koa-router");
const KoaBody = require("koa-body");

require("./services/tasks");

const app = new Koa();
const router = new Router();

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 5 * 1024 * 1024
        }
    })
);

const task = require("./api/task");
const setting = require("./api/setting");
const test = require("./api/index");

router.use("/api_todo/setting", setting.routers);
router.use("/api_todo/task", task.routers);
router.use("/api_todo/test", test.routers);

app.use(router.routes()).use(router.allowedMethods());

app.on("error", (err, ctx) => console.error("server error", err));

const port = process.env.PORT || "18612";

app.listen(port, function() {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
