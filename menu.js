const fs = require('fs');
const request = require('request');

//token，因为token是存在文件里的所以这里进行文件读取得到token
// const token = fs.readFileSync('./token').toString();
fs.exists('./accessToken.txt', (exists) => {
    if (exists) {
        const str = fs.readFileSync('./accessToken.txt').toString()
        const token = JSON.parse(str).access_token
        //常用type为view和click,分别为点击事件和链接
        var menus = {
            "button": [
                {
                    "name": "web前端",
                    "sub_button": [
                        {
                            "type": "view",
                            "name": "授权登录",
                            "url": "https://mp.weixin.qq.com"
                        }]
                },
                {
                    "name": "java后端",
                    "sub_button": [
                        {
                            "type": "view",
                            "name": "授权登录",
                            "url": "https://mp.weixin.qq.com"
                        }]
                },

            ]
        };

        function createMenu() {
            let options = {
                url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + token,
                form: JSON.stringify(menus),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            request.post(options, function (err, res, body) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(body);
                }
            })

        }

        createMenu()
    }
})
