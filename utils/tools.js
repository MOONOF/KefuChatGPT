// 接收到微信服务器后对数据处理的⼀些常规⽅法
const { parseString } = require('xml2js');
module.exports = {
    //获取⽤户发送的消息
    getUserData(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            //当流式数据传递过来时会触发该事件
            req.on('data', (data) => {
                //读取的数据是buffer，需要转换成字符串
                xmlData += data.toString();
            })
                //数据传递结束时触发，将最终数据返回
                .on('end', () => {
                    resolve(xmlData);
                })
        })
    },
    //解析xml为js，借助插件
    parseXml(data) {
        return new Promise((resolve, reject) => {
            parseString(data, { trim: true }, (err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject(err);
                }
            })
        })
    },
    // 格式化，去除⽆⽤数据，去除空数据，数组转化为key-value
    formatMsg(msg) {
        let message = {};
        msg = msg.xml;
        if (typeof msg === 'object') {
            for (let i in msg) {
                let value = msg[i];
                if (Array.isArray(value) && value.length != 0) {
                    message[i] = value[0];
                }
            }
        }
        return message;
    }
}


