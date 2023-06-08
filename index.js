const express = require("express");
const auth = require("./auth.js");
const app = express();
const config = require("./config.js");
app.use(auth());

const rp = require("request-promise-native");
const { writeFile, readFile } = require("fs");
const { appID, appsecret } = config;
// const appID = 'wx04baed3096e7206f'
// const appsecret = 'eb47fb717c8c1b708b603cc070256b6f'

class Wechat {
  constructor() {}
  getAccessToken() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve, reject) => {
      rp({ method: "GET", url, json: true })
        .then((res) => {
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resolve(res);
        })
        .catch((err) => {
          reject("getAccessToken:" + err);
        });
    });
  }
  saveAccessToken(accessToken) {
    accessToken = JSON.stringify(accessToken);
    return new Promise((resolve, reject) => {
      writeFile("./accessToken.txt", accessToken, (err) => {
        if (!err) {
          resolve();
        } else {
          reject("saveAccessToken:" + err);
        }
      });
    });
  }

  readAccessToken() {
    return new Promise((resolve, reject) => {
      readFile("./accessToken.txt", (err, data) => {
        if (!err) {
          data = JSON.parse(data);
          resolve(data);
        } else {
          reject("readAccessToken:" + err);
        }
      });
    });
  }

  isVaildAccessToken(data) {
    if (!data && !data.access_token && !data.expires_in) {
      returnfalse;
    }
    return data.expires_in > Date.now();
  }
  fetchAccessToken() {
    return new Promise((resolve, reject) => {
      this.readAccessToken()
        .then(async (res) => {
          if (this.isVaildAccessToken(res)) {
            resolve(res);
          } else {
            const res = await this.getAccessToken();
            await this.saveAccessToken(res);
            resolve(res);
          }
        })
        .catch(async (err) => {
          const res = await this.getAccessToken();
          await this.saveAccessToken(res);
          resolve(res);
        });
    });
  }
}
const wx = new Wechat();
wx.fetchAccessToken();

//挂载参数处理的中间件
app.listen(80, () => {
  console.log("服务器运⾏成功了");
});
