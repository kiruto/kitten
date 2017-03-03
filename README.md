## kitten是什么

kitten是使用TypeScript编写的HTML5图片浏览器应用. kitten使用HTML5的两种特性来显示图片, 分别是canvas和css3. 其中PC端各浏览器可以使用[excanvas](https://github.com/arv/explorercanvas)使程序支持救版本浏览器; 手机平台可以使用css3的方式支持大部分手机浏览器. 

kitten只依赖[Rxjs](https://github.com/ReactiveX/rxjs), Rxjs的浏览器支持:

[![Selenium Test Status](https://saucelabs.com/browser-matrix/rxjs5.svg)](https://saucelabs.com/u/rxjs5)

kitten使用flapper搭建, 工程运行环境及开发环境参考[flapper](https://github.com/kiruto/flapper)项目.

## 使用方法
1. clone本项目

    ```bash
    git clone https://github.com/kiruto/kitten
    ```
    
2. 安装依赖环境

    ```bash
    npm install
    ```
    
3. 编译项目
    - 修改编译环境[./config/flapper.config.js](./config/flapper.config.js).
        
        ```javascript
        module.exports = {
            // 是否是测试环境
            debug: true,
            // 版本信息
            version: '1.0.0'
        };
        ```
        
    - 编译
        
        ```bash
        npm run build
        ```
        
        如果是生产环境, 将会使用[./config/environment.prop.js](./config/environment.prop.js)作为环境变量, 并编译成uglify js文件. 
        编译结果在".dist"目录中. 

4. 使用
    在HTML文件<body>标签中引入上一步编译好的文件, 脚本成功加载后会看到一个window.kitten的变量（模块）, 通过该变量（模块）来使用kitten. 

## 单元测试
1. 在./src目录下的所有**/*.spec.ts文件都被用来测试. 
2. 执行以下命令进行测试
    
    ```bash
    npm test
    ```

## API

### 配置
通过```window.kitten.ivConfig```变量控制. 
- scale
- move
- touchScale
- touchMove
- brightness
- contrast
- scaleMinSize

### ElementManager

实现类为```window.kitten.CanvasElementManager```及```window.kitten.CSSElementManager```.

- 构造函数
- attr
- loadImageUrls
- changeMode
- reset
- destroy

## FAQ
- 我是否需要用TypeScript?

    kitten使用TypeScript实现, 将工程编译为js文件. 不规定是否使用TypeScript. 使用kitten可以用任何支持原生js的语言.
    
- 如何开启canvas模式CORS?

    kitten处理来自不同host的图片时需要服务器和js同时设置支持CORS. kitten应用中在img标签使用 crossorigin 属性，结合合适的 CORS 响应头, 就可以实现在画布中使用跨域 <img> 元素的图像.
    需要开启, 请在ElementManager对象中使用attr函数加入该属性:
    
    ```javascript
    var mgr = new kitten.CanvasElementManager("root-id");
    mgr.attr({
        crossorigin: "anonymous"
    });
    ```
    
    服务器同样需要开启CORS支持, 具体请参阅文档: [启用了 CORS 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)
    
    有关crossorigin属性设置: [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)


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