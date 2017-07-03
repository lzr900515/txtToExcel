/**
 * 生成excel的处理模块
 */

var xlsx = require('xlsx');
var config = require('./../config/config');
var path = require('path');

/**
 * excelData： 表头对应的内容
 * callback：回掉函数（非必需）
 */
function exportExcel(excelData, callback) {

  // excel用的表头，由config文件控制
  var _header = config.excelConfig.tableHead;
  var _data = excelData;

  // 为 _headers 添加对应的单元格位置
  var header = _header.map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  // 匹配 headers 的位置，生成对应的单元格数据
  var data = _data.map((v, i) => _header.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  // 合并 headers 和 data
  var output = Object.assign({}, header, data);
  var outputPos = Object.keys(output);
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

  // 设置 workBook
  var workBook = {
    SheetNames: [config.excelConfig.sheetName],
    Sheets: {}
  };

  workBook.Sheets[config.excelConfig.sheetName] = Object.assign({}, output, { '!ref': ref });

  // console.dir(workBook);

  // 导出Excel
  var dist = path.join(config.excelConfig.excelPath, config.excelConfig.excelName);
  xlsx.writeFile(workBook, dist);

  if (typeof callback == 'function') {
    callback();
  }
}

module.exports = exportExcel;