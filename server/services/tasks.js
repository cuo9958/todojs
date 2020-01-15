const CronJob = require("cron").CronJob;
const utils = require("./utils");
const TaskModel = require("../models/tasks");
const DDService = require("./dingding");

new CronJob("0 0 * * * *", runTask("00")).start();
new CronJob("0 30 * * * *", runTask("30")).start();
new CronJob("0 */1 * * * *", other).start();

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
            run_end(item);
        });
    };
}

function run_end(model) {
    DDService.msgTo(model.title, model.tell.split(","), model.is_all);
    if (model.to_count > 1) {
        Task_list.push({
            title: model.title,
            tell: model.tell,
            count: model.to_count - 1,
            is_all: model.is_all
        });
    } else {
        TaskModel.update({ status: 0 }, model.id);
    }
}

function other() {
    const list = [];
    Task_list.forEach(item => {
        DDService.msgTo(item.title, item.tell.split(","), item.is_all);
        if (item.count > 1) {
            item.count--;
            list.push(item);
        } else {
            TaskModel.update({ status: 0 }, item.id);
        }
    });
    Task_list = list;
}
