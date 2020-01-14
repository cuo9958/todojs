const CronJob = require("cron").CronJob;
const utils = require("./utils");
const TaskModel = require("../models/tasks");
const DDService = require("./dingding");

new CronJob("* 0 * * * *", runTask("00")).start();
new CronJob("* 30 * * * *", runTask("30")).start();
new CronJob("* */1 * * * *", other).start();

let Task_list = [];

function runTask(ext) {
    return async function() {
        const now = new Date();
        const day = utils.DateFormart(now, "yyyy-MM-dd");
        const time_h = utils.DateFormart(now, "hh");
        const last_time = time_h + ":" + ext;
        const list = await TaskModel.search(day, last_time);
        console.log(day, last_time);
        list.forEach(item => {
            DDService.msgTo(item.title, item.tell.split(","));
            if (item.to_count > 1) {
                Task_list.push({
                    title: item.title,
                    tell: item.tell,
                    count: item.to_count - 1
                });
            }
        });
    };
}

function other() {
    const list = [];
    Task_list.forEach(item => {
        DDService.msgTo(item.title, item.tell.split(","));
        if (item.count > 1) {
            item.count--;
            list.push(item);
        }
    });
    Task_list = list;
}
