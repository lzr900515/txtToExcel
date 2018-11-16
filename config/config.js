/**
 * report-maker 的参数配置文件
 */

var config = {
    // 对象文件存放目录
    filePath: './importTxt',
    // 源文件切割规则
    splitRules: {
        lineDividerMark: '$$$LZR_LINE_DIVIDER$$$',
        page: 'Quadrant Subscriptions Services',
        tableBegin: '7X/602',
        offThisWeek: 'Off This Week',
        onThisWeek: 'On This Week',
        rowLength: 3, //3行有效数据
        columnLength: 132, //每行132字符
        columnWidth: [
            0,
            10,
            20,
            32,
            69,
            102,
            131
        ]//每列宽度

    },
    // 导出Excel相关配置
    excelConfig: {
        // Excel表头
        tableHead: [
            {
                header: '户号',
                key: 'huhao'
            },
            {
                header: '线号',
                key: 'xianhao'
            },
            {
                header: '起期',
                key: 'qiqi',
                width: 20
            },
            {
                header: '止期',
                key: 'zhiqi',
                width: 20
            },
            {
                header: '户名',
                key: 'huming',
                width: 20
            },
            {
                header: '订户分类',
                key: 'dinghufenlei',
            },
            {
                header: '份数',
                key: 'fenshu'
            },
            {
                header: '职务',
                key: 'zhiwu',
                width: 20
            },
            {
                header: '单位',
                key: 'danwei',
                width: 50
            },
            {
                header: '地址',
                key: 'zh_dizhi',
                width: 100
            },
            {
                header: '邮编',
                key: 'youbian'
            },            {
                header: '地址',
                key: 'dizhi',
                width: 100
            }
        ]
    },
    // 百度翻译配置
    baiduConfig: {
        appid: '20181116000235338',
        key: '_IcS28x2bMtcENqA1r8s',
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
    }
};

module.exports = config;