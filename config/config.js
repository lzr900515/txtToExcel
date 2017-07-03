/**
 * report-maker 的参数配置文件
 */

var config = {
  // 对象文件存放目录
  filePath: './../../Report',
  // 对象文件名
  fileName: 'Policy.txt',
  // 源文件切割规则
  splitRules: {
    policyName: 'Policy Name:',
    client: 'Client/HW/OS/Pri/CIT:',
    policyType: 'Policy Type:',
    include: 'Include:',
    schedule: 'Schedule:',
    scheduleResidence: 'Residence:'
  },
  // 导出Excel相关配置
  excelConfig: {
    // 导出excel的目录
    excelPath: './data',
    // 导出excel的文件名
    excelName: 'Policy.xlsx',
    // Excel表头
    tableHead: ['policyName', 'client', 'policyType', 'include', 'schedule', 'scheduleResidence'],
    // WorkSheet结构
    sheetName: 'Policy'
  }
};

module.exports = config;