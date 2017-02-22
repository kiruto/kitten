# Flip Flapping!
<img src="art/cover.jpg" alt="Papika" width="200"/>

使用node环境快速搭建TypeScript应用

|          | 环境       | 开发环境版本 | 是否支持最新版 |
|----------|------------|--------------|:--------------:|
| Runtime  | NodeJS     | v6.9.1       |       是       |
| package  | NPM        | 4.0.2        |       是       |
| 脚本语言 | TypeScript | ^2.1.6       |       是       |
| 编译     | Webpack2   | ^2.2.1       |       是       |
| 测试     | Karma      | ^1.4.1       |       是       |

## 准备工作
必须使用[Node.js和NPM](https://nodejs.org/en/)环境
- 支持Node v6 latest
- 支持npm v4 latest

## 安装
1. clone本项目
```bash
git clone https://github.com/kiruto/flapper
```
2. 安装依赖环境
```bash
npm install
```

完成！现在可以在Flapper基础上开发了！

## 单元测试
1. 在./src目录下的所有**/*.spec.ts文件都被用来测试。本工程下[./src/app/flip-flappers.spec.ts](src/app/flip-flappers.spec.ts)是一个简单的测试实例。
2. 执行以下命令进行测试
```bash
npm test
```
如果没有修改环境变量, 可以看到一个chrome浏览器对脚本进行测试的过程。

## 编译
执行以下命令将index.ts为入口的程序编译，并输出在./dist下
```bash
npm run build
```

## 环境变量
可以直接修改环境变量文件
- 测试环境: [environment.js](config/environment.js)
- 生产环境: [environment.prod.js](config/environment.prod.js)

## License
```text
The MIT License

Copyright (c) 2010-2017 Yuriel. http://exyui.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```