/**
 * 钉钉的消息服务
 */
const axios = require("axios");
const config = require("config");

const DDConfig = config.get("dingding");

/**
 * 发送消息
 * @param {*} t 类型：text、link
 * @param {*} opts 参数
 */
function createMsg(t = "text", opts = {}) {
    if (t === "text") {
        const lastP = [];
        const isAll = !!opts.isAll;
        if (!isAll && opts.tell.constructor === Array) {
            opts.tell.forEach(item => {
                lastP.push("@" + item);
            });
        }
        return {
            msgtype: "text",
            text: {
                content: DDConfig.preTxt + opts.msg + lastP.join("")
            },
            at: {
                atMobiles: opts.tell || [],
                isAtAll: isAll
            }
        };
    }
    if (t === "link") {
        return {
            msgtype: "link",
            link: {
                text: opts.msg,
                title: DDConfig.preTxt + opts.title,
                picUrl: opts.img || "",
                messageUrl: opts.link || ""
            }
        };
    }
}

function msgAction(t, data) {
    axios({
        method: "POST",
        url: DDConfig.url,
        data: createMsg(t, data)
    })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    msgTo(msg, tell, isAll) {
        msgAction("text", {
            msg,
            tell,
            isAll
        });
    },
    msgLinkTo(title, msg, img, link) {
        msgAction("link", {
            title,
            msg,
            img,
            link
        });
    }
};
