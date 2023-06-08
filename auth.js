const sha1 = require("sha1");
const { getUserData, parseXml, formatMsg } = require("./utils/tools");
const msgTemp = require("./msgTemp");
const replay = require("./replay");
const config = require("./config.js");
const request = require("request");
const fs = require("fs");
// 获取token
module.exports = () => {
  return (req, res, next) => {
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = config;
    const sha1Str = sha1([timestamp, nonce, token].sort().join("")); //sha1需要⼿动安装引⼊
    if (sha1Str === signature) {
      res.send(echostr);
    } else {
      res.send("error");
    }
  };
};

// 改造服务器的有效性⽅法
//引⼊配置对象
// 回复消息
module.exports = () => {
  return async (req, res, next) => {
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token } = config;
    const sha1Str = sha1([timestamp, nonce, token].sort().join(""));
    //sha1需要⼿动安装引⼊
    if (req.method == "GET") {
      //当前是验证服务器有效性消息
      if (sha1Str === signature) {
        res.send(echostr);
      } else {
        res.end("error");
      }
    } else if (req.method == "POST") {
      if (sha1Str !== signature) {
        res.end("error");
      }
      //接收请求体中数据（⽤户在客户端发送的消息）
      let xmlData = await getUserData(req);
      //将xml解析成js对象
      let jsData = await parseXml(xmlData);
      //格式化数据
      let msg = formatMsg(jsData);
      //实现⾃动回复
      let options = await replay(msg);

      // let replayMsg = msgTemp(options);
      // //发送数据给微信服务器
      // res.send(replayMsg);
    } else {
      res.end("error");
    }
  };
};
