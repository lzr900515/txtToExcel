## Report-maker

---
一个将给定格式的txt文件转化为Excel的小工具。使用了

#### 版本： 1.0.0
#### 语言：  Node.js

### 使用方法
1. 下载本程序包，解压。
2. cd到程序目录，执行`npm install`安装依赖。
3. config目录中对`config.js`进行配置。Windows下注意路径需要将“\”换成“/”。不然会报错。
4. 在主目录下创建data文件夹（默认生成的Excel的存放位置）。
5. 执行`node report-maker.js`即可。

### ToDoList for next version
- [ ]  导入为Word模板(可能要面临换依赖模块的情况)
- [ ]  配置文件的重新设计

#### License：MIT