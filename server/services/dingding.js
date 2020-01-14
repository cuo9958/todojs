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
        if (opts.tell.constructor === Array) {
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
                isAtAll: !!opts.isAll
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
    });
}

module.exports = {
    msgTo(msg, tel) {
        msgAction("text", {
            msg
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
