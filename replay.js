// 对所有收到的消息、事件进⾏统⼀处理
//处理接收普通消息、接收事件推送
const fetch = require("node-fetch");
const request = require("request");
const fs = require("fs");
const AK = "RtkUdQWUnbIGan5eElIVCGVc";
const SK = "D5xWsDqDAmfGiuW9pLCC3VOv3Kx7TqmN";

// 获取百度内容审核token
function getAccessToken() {
  let options = {
    method: "POST",
    url:
      "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" +
      AK +
      "&client_secret=" +
      SK,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}

// 调用公众号客服回复
async function service(msg, str) {
  const str1 = fs.readFileSync("./accessToken.txt").toString();
  const wx_token = JSON.parse(str1).access_token;

  let params = {
    method: "POST",
    url:
      "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" +
      wx_token,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      touser: msg.ToUserName,
      msgtype: "text",
      text: {
        content: str,
      },
    },
  };
  await request(params, (error, response) => {
    console.log(response);
  });
}

module.exports = async (msg) => {
  let that = this;
  //接收⼈和发送⼈需要互换⾓⾊
  let options = {
    ToUserName: msg.FromUserName,
    FromUserName: msg.ToUserName,
    CreateTime: Date.now(),
    MsgType: msg.MsgType,
  };
  let content = ``;
  //普通消息

  if (msg.MsgType == "text") {
    var options1 = {
      method: "POST",
      url:
        "https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=" +
        (await getAccessToken()),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      form: {
        text: msg.Content,
      },
    };

    await request(options1, function (error, response) {
      if (error) {
        content = `请输入合法问题进行提问`;
      } else {
        try {
          const requestOenAi = async () => {
            let value = msg.Content;
            const apiKey =
              "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";
            const messages = JSON.parse(
              '[{"role": "user", "content": "唐诗" }]'
            );
            messages[0].content = value;
            console.log("message", messages);
            const response = await fetch(
              "https://api.openai.com/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model: "gpt-3.5-turbo-0301",
                  messages: messages,
                }),
              }
            );
            return await response.json();
          };
          requestOenAi().then(async (r) => {
            console.log("r", r);
            let string = "";
            let str = r.choices[0].message.content;
            console.log("str", str);
            content = str;

            await service(msg, str);
          });
        } catch (error) {
          // Consider implementing your own error handling logic here
          console.error(error);
          content = `Sorry,出现了一点小故障,请联系管理员`;
        }
      }
    });
  } else if (msg.MsgType == "image" || msg.MsgType == "voice") {
    options.MediaId = msg.MediaId;
  } else if (msg.MsgType == "video") {
    options.MediaId = msg.MediaId;
  } else if (msg.MsgType == "shortvideo") {
    options.MediaId = msg.MediaId;
  } else if (msg.MsgType == "location") {
    options.MediaId = msg.MediaId;
  } else if (msg.MsgType === "event") {
    if (msg.Event === "subscribe") {
      content = `终于等到你，还好我没放弃`;
    }
  }
  //事件推送
  options.MediaId = "";
  options.content = content;
  return options;
};
