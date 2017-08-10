/**
 * Opscenter利用模板
 * 利用使用json格式数据，生成word文件
 */
var fs = require("fs"),
  docx = require('./../pdocx/build');

const styles = new docx.Styles();

styles.createParagraphStyle('Heading1', 'Heading 1')
  .basedOn("Normal")
  .next("Normal")
  .quickFormat()
  .size(28)
  .bold()
  .italics()
  .spacing({ after: 120 });

styles.createParagraphStyle('Heading2', 'Heading 2')
  .basedOn("Normal")
  .next("Normal")
  .quickFormat()
  .size(26)
  .bold()
  .underline('double', 'FF0000')
  .spacing({ before: 240, after: 120 });

var doc = new docx.Document();

doc.createParagraph('Test heading1, bold and italicized').heading1();
doc.createParagraph('Some simple content');
doc.createParagraph('Test heading2 with double red underline').heading2();

var table = doc.createTable(3, 3);
table.getCell(0, 0).createParagraph().createTextRun('text run').bold();
table.getCell(0, 1).createParagraph('sdsadaa');
table.getCell(0, 2).createParagraph('sdsadaa');
table.getCell(1, 0).createParagraph('sdsadaa');
table.getCell(1, 1).createParagraph('sdsadaa');
table.getCell(1, 2).createParagraph('sdsadaa');
table.getCell(2, 0).createParagraph('sdsadaa');
table.getCell(2, 1).createParagraph('sdsadaa');
table.getCell(2, 2).createParagraph('sdsadaa');

console.dir(Object.keys(table));

const exporter = new docx.LocalPacker(doc, styles, undefined, undefined);
exporter.pack('test.docx');