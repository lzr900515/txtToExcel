/**
 * 主程序处理模块
 */
const fs = require('fs');
const config = require('./config/config');
const Excel = require("exceljs");
const translateBaidu = require('./utils/translateBaidu').translateBaidu;

const importTxtList = fs.readdirSync(config.filePath);
importTxtList.forEach((filename, i) => {
    let workbook = new Excel.Workbook();
    let onPromiseAll = [];
    let offPromiseAll = [];
    let importFileInfo = {
        name: filename,
        exportName: filename.split('.')[0] + '.xlsx',
        pageList: [],
        onThisWeek: [],
        offThisWeek: []
    };
    if (/.txt$/.test(filename)) {
        fs.readFile(`${config.filePath}/${filename}`, 'UTF-8', function (err, data) {
            let withOutReturn = data.split('\r\n').join(`${config.splitRules.lineDividerMark}`);
            if (err) {
                console.log('Error: 读取文件异常', err);
            } else {
                console.log(`Start: 开始解析文件（${config.filePath}/${filename}）`);
                const pageArr = getPageArr(withOutReturn);
                pageArr.forEach((page, index) => {
                    // 单页数据信息
                    let pageInfo = {
                        onThisWeek: false,
                        tableList: []
                    };
                    pageInfo.onThisWeek = page.includes(`${config.splitRules.onThisWeek}`);
                    console.log(`开始解析_____Page-${index}` + '_____ On This Week: ' + pageInfo.onThisWeek + '_____');
                    getTablesFromPage(page).forEach(tableDataArr => {
                        // 过滤 \f 数据
                        if (tableDataArr.length > 2) {
                            let formatData = getTableKeyMap(tableDataArr);
                            //过滤一下地址
                            let filterAddress = ['SHANGHAI', 'JIANGSU', 'ZHEJIANG', 'JIANGXI', 'ANHUI', 'FUJIAN', 'HUNAN', 'HUBEI'];
                            let notInfilterArr = !filterAddress.some(address =>
                                formatData.dizhi.toUpperCase().includes(address)
                            );
                            if (notInfilterArr) {
                                pageInfo.tableList.push(formatData);
                                if (pageInfo.onThisWeek) {
                                    // get请求，#号后的无法传输
                                    onPromiseAll.push(translateBaidu(formatData.dizhi.replace('#', '')));
                                } else {
                                    formatData.huhao = 'A' + formatData.huhao;
                                }
                            } else {
                                console.log(`${formatData.dizhi.toUpperCase()} 不在负责范围内，已被过滤！！！！`);
                            }
                        }
                    });
                    if (pageInfo.onThisWeek) {
                        importFileInfo.onThisWeek = importFileInfo.onThisWeek.concat(pageInfo.tableList);
                    } else {
                        importFileInfo.offThisWeek = importFileInfo.offThisWeek.concat(pageInfo.tableList);
                    }
                });
            }
            Promise.all(onPromiseAll).then(result => {
                result.forEach((data, i) => {
                    if (data.error_code) {
                        importFileInfo.onThisWeek[i].zh_dizhi = `翻译失败：（${data.error_msg}）`;
                    } else {
                        importFileInfo.onThisWeek[i].zh_dizhi = data.trans_result[0].dst;
                    }
                });
            }).then(result => {
                // 生成excel
                let onWorkSheet = workbook.addWorksheet("onThisWeek");
                let offWorkSheet = workbook.addWorksheet("offThisWeek");
                onWorkSheet.columns = config.excelConfig.onTableHead;
                onWorkSheet.addRows(importFileInfo.onThisWeek);
                offWorkSheet.columns = config.excelConfig.offTableHead;
                offWorkSheet.addRows(importFileInfo.offThisWeek);
                workbook.xlsx.writeFile(`./exportExcel/${importFileInfo.exportName}`).then(function () {
                    console.log(`文件:${filename}已处理完成`);
                });
            }).catch(err => {
                console.log('网络异常，翻译失败', err);
            });
        });
    } else {
        console.log(`Warning: 待处理文件必须为txt格式。(${filename})`);
    }
});

//分页函数
function getPageArr(fileContent) {
    return fileContent.split(`${config.splitRules.page}`).slice(1, -1);
}

//页内容获取Table
function getTablesFromPage(pageContent) {
    let tableList = pageContent.split('-'.repeat(config.splitRules.columnLength));
    return tableList.map((table, index) => {
        let firstTable = table;
        if (index === 0) {
            firstTable = `${config.splitRules.lineDividerMark}${config.splitRules.tableBegin}`
                + table.split(config.splitRules.tableBegin)[1];
        }
        return firstTable.split(config.splitRules.lineDividerMark).slice(1, -1);
    });
}

//根据table的每行数据截取字段
function getTableKeyMap(tableDataArr) {
    let keyValMap = {};
    let valArr = [];
    tableDataArr.forEach((lineData, lineNum) => {
        if (lineData) {
            valArr = valArr.concat(getLineVal(lineData));
        }
    });
    keyValMap = {
        'huhao': valArr[1],
        'xianhao': '',
        'qiqi': '',
        'zhiqi': valArr[14],
        'huming': valArr[3],
        'dinghufenlei': '',
        'fenshu': valArr[8],
        'zhiwu': valArr[9],
        'danwei': `${valArr[4]} ${valArr[5]}`,
        'dizhi': `${valArr[10]}, ${valArr[11]}, ${valArr[15]}, ${valArr[16]}, ${valArr[17]}`,
        'youbian': valArr[2]
    };
    return keyValMap;
}

//拆分每行的数据字
function getLineVal(lineData) {
    let lineValArr = [];
    lineValArr[0] = (lineData.slice(config.splitRules.columnWidth[0], config.splitRules.columnWidth[1]) || '').trim();
    lineValArr[1] = (lineData.slice(config.splitRules.columnWidth[1], config.splitRules.columnWidth[2]) || '').trim();
    lineValArr[2] = (lineData.slice(config.splitRules.columnWidth[2], config.splitRules.columnWidth[3]) || '').trim();
    lineValArr[3] = (lineData.slice(config.splitRules.columnWidth[3], config.splitRules.columnWidth[4]) || '').trim();
    lineValArr[4] = (lineData.slice(config.splitRules.columnWidth[4], config.splitRules.columnWidth[5]) || '').trim();
    lineValArr[5] = (lineData.slice(config.splitRules.columnWidth[5], config.splitRules.columnWidth[6]) || '').trim();
    return lineValArr;
}