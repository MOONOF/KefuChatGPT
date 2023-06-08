module.exports = options => {
    //消息模板在官⽹上获取，由于上⼀步发送和接收⼈已经替换，这⾥不需要再次替换
    let str = `<xml>
    <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
    <CreateTime>${options.CreateTime}</CreateTime>
    <MsgType><![CDATA[${options.MsgType}]]></MsgType>`;
    if (options.MsgType == 'text') {
        str += `<Content><![CDATA[${options.content}]]></Content>`;
    } else if (options.MsgType == 'image') {
        str += `<Image><MediaId><![CDATA[${options.MediaId}]]></MediaId></Image>`;
    } else if (options.MsgType === 'event') {
        str = `<xml>
        <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
        <CreateTime>${options.CreateTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${options.content}]]></Content>`;
    } else if (options.MsgType == 'voice') {
        str += `<Voice><MediaId><![CDATA[${options.MediaId}]]></MediaId></Voice>`;
    } else if (options.MsgType == 'video') {
        str += `<Video>
    <MediaId><![CDATA[${options.MediaId}]]></MediaId>
    <Title><![CDATA[${options.title}]]></Title>
    <Description><![CDATA[${options.description}]]></Description>
    </Video>`;
    } else if (options.MsgType == 'music') {
        str += `<Music>
    <Title><![CDATA[${options.title}]]></Title>
    <Description><![CDATA[${options.description}]]></Description>
    <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
    <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
    <ThumbMediaId><![CDATA[${options.MediaId}]]></ThumbMediaId>
    </Music>`;
    } else if (options.MsgType == 'news') {
        str += `<ArticleCount>${options.content.length + 1}</ArticleCount><Articles>`
        options.content.forEach(item => {
            str += `<item>
    <Title><![CDATA[${item.title}]]></Title>
    <Description><![CDATA[${item.description}]]></Description>
    <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
    <Url><![CDATA[${item.url}]]></Url>
    </item>`
        })
        str += `</Articles>`;
    }
    str += '</xml>';
    return str;
}