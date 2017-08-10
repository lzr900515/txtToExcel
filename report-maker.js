/**
 * 主程序处理模块
 */
var fs = require('fs'),
  path = require('path');

var config = require('./config/config'),
  exportExcel = require('./src/excel-maker');

var filePath = path.join(config.filePath, config.fileName);
// console.log(filePath);

/**
 * 对每一个policy进行整理 使其符合表格插入的形式
 * @param {*} policy 
 * {
 *  policyName: String
 *  client: []]
 *  policyType: String
 *  include: []
 *  schedule[]
 *  scheduleResidence: String
 * }
 * 
 */
function policyFormatter(policy) {

  // console.log(policy)

  var policyNameMatcher = new RegExp(config.splitRules.policyName + "([\\s\\w\\d\\-]*)\\r\\n"),
    clientMatcher = new RegExp(config.splitRules.client + "([\\s\\w\\d\\?\\-\\.]*)\\r\\n", "g"),
    policyTypeMatcher = new RegExp(config.splitRules.policyType + "([\\s\\w\\d\\(\\)\\-]*)\\r\\n"),
    includeMatcher = new RegExp(config.splitRules.include + "([\\s/\\w\\.\\\\:_\\?=\\\"\\*\\W]*)\\r\\n", "g");

  var scheduleLists = policy.split(config.splitRules.schedule).slice(1),
    scheduleFormatLists = [],
    scheduleResidenceMatcher = new RegExp(config.splitRules.scheduleResidence + "([\\s\\w\\d\\-\\(\\)]*)\\r\\n");

  scheduleLists.forEach(function (schedule) {
    var scheduleFormat = config.splitRules.schedule + schedule;
    scheduleFormatLists.push(scheduleFormat);
  });

  // console.log(scheduleFormatLists);

  var results = {
    policyName: policy.match(policyNameMatcher)[1].trim(),
    client: policy.match(clientMatcher) ? policy.match(clientMatcher).join('').trim() : '',
    policyType: policy.match(policyTypeMatcher)[1].trim(),
    include: policy.match(includeMatcher)?policy.match(includeMatcher).join('').trim():'',
    schedule: scheduleFormatLists.join('').trim(),
    scheduleResidence: scheduleLists[0]?scheduleLists[0].match(scheduleResidenceMatcher)[1].trim():''
  };

  // console.dir(results);
  return results;
}

fs.readFile(filePath, 'UTF-8', function (err, data) {
  if (err) throw err;
  // 对文件读取的数据进行处理，首先用 policyName 进行切割
  var policyLists = data.split(config.splitRules.policyName);
  if (policyLists[0] === '\r\n') {
    policyLists.shift();
  };

  var excelData = [];

  policyLists.forEach(function (policy) {
    var policyData = policyFormatter(config.splitRules.policyName + policy);
    excelData.push(policyData);
  });

  //  console.log(excelData);

  exportExcel(excelData, function () {
    console.log('Excel文件导出完成。');
  });
  // console.log(policyLists);
});