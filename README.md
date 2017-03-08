## kitten是什么

kitten是使用TypeScript编写的HTML5图片浏览器应用. kitten使用HTML5的两种特性来显示图片, 分别是canvas和css3. 其中PC端各浏览器可以使用[excanvas](https://github.com/arv/explorercanvas)使程序支持救版本浏览器; 手机平台可以使用css3的方式支持大部分手机浏览器. 

kitten只依赖[Rxjs](https://github.com/ReactiveX/rxjs), Rxjs的浏览器支持:

[![Selenium Test Status](https://saucelabs.com/browser-matrix/rxjs5.svg)](https://saucelabs.com/u/rxjs5)

kitten使用flapper搭建, 工程运行环境及开发环境参考[flapper](https://github.com/kiruto/flapper)项目.

## Demo

一点微小的使用示例: 

- [css-image-viewer-demo](http://htmlpreview.github.io/?https://github.com/kiruto/kitten/blob/master/example/css-image-viewer/index.html)

    主要演示了kitten CSS3模式的基本使用方法

    [源码: ./example/css-image-viewer](./example/css-image-viewer)

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
        # read envireonment from config file "./config/flapper.config.js"
        npm run build
        
        # or use production envireonment directly
        mpm run build-prod
        ```
        
        如果是生产环境, 将会使用[./config/environment.prop.js](./config/environment.prop.js)作为环境变量, 并编译成uglify js文件. 
        编译结果在".dist"目录中. 

4. 使用

    在HTML的body标签中引入上一步编译好的文件, 脚本成功加载后会看到一个 ```window.kitten``` 的变量(模块), 通过该变量(模块)来使用kitten.
     
## 单元测试
1. 在./src目录下的所有**/*.spec.ts文件都被用来测试. 
2. 执行以下命令进行测试
    
    ```bash
    npm test
    ```
    
## 环境变量
可以直接修改环境变量文件
- 测试环境: [environment.js](config/environment.js)
- 生产环境: [environment.prod.js](config/environment.prod.js)

## API

### 配置
通过 ```window.kitten.ivConfig``` 变量控制. 
* canvas

    ```window.kitten.CanvasElementManager``` 的参数设置.
    
    ```window.kitten.ivConfig.canvas``` :
    
    - scale
    - move
    - touchScale
    - touchMove
    - brightness
    - contrast
    - scaleMinSize
    
* css

    ```window.kitten.CSSElementManager``` 的参数设置.
    
    ```window.kitten.ivConfig.css``` :
    
    - scale
    - move
    - touchScale
        范围为(0.0, 1.0)内的number, 数值越大速度越快.
    - touchMove
        范围为(0.0, 1.0)内的number, 数值越大速度越快.
    - brightness
    - contrast
    - scaleMinSize

### ElementManager

实现类为 ```window.kitten.CanvasElementManager``` 及 ```window.kitten.CSSElementManager``` .

- constructor(rootId)

    构造器. 接受一个string型的id作为参数. 参数为需要展示图片的父div的id, 父div的 ```innerHTML``` 最好为空.
    
    HTML:
    
    ```html
    <div id="desktop">loading...</div>
    ```
    
    JavaScript:
    
    ```javascript
    var mgr = new kitten.CanvasElementManager("desktop");
    ```
    
- conf

    当前设置. 设置内容为只读, 禁止修改其内容.
    
- attr(attribute)

    设置由kitten生成的子DOM的HTML属性.
    
    当设置了如下参数时:
    
    ```javascript
    mgr.attr({ class: "kitten", demo: "true" });
    ```
    
    实际的HTML会展现如下:
    
    ```html
    <div id="desktop" ... >
      <img class="kitten" demo="true" ... />
    </div>
    ```
    
- loadImageUrls(urls)
    
    加载图片列表.
    
    ```javascript
    mgr.loadImageUrls([
      "http://exyui.com/kitten_example_1.jpg",
      "http://exyui.com/kitten_example_2.jpg",
      /* etc...*/
    ]);
    ```

- changeMode(mode)

    改变动作模式.
    
    ```javascript
    mgr.changeMode(kitten.mode.SCALE);
    ```
    
    * CHANGE
        更换图片. PC端通过鼠标滚轮换图, 手机端通过单指拖动换图;
    
    * SCALE
        缩放. '鼠标Y轴位移'或'手指拖动手机屏幕焦点Y轴'控制图片大小;
        
    * MOVE
        移动. 鼠标拖拽，或手指拖拽手机屏幕控制图片位置;
    
    * BRIGHTNESS_CONTRAST
        亮度和对比度. '鼠标X轴'或'手指拖动手机屏幕焦点X轴'控制亮度, Y轴控制对比度.
    
- reset()

    复位. 浏览原始图片.
    
- prev()

    切换前一张图片. 

- next()

    切换后一张图片. 
    
- getImageUrlList()

    获取已加载的图片URL列表. 
    
- getCurrentImageUrl()

    获取当前浏览的图片URL. 
    
- destroy()

    回收.

- observable

    kitten通过rxjs的observable实现函数的回调
    
    * imageDownloadObservable
    
        当图片下载完毕时会生产一个事件.
        
        ```javascript
        mgr.imageDownloadObservable.subscribe({
          next: function(element) {
            // 当某张图片下载完毕, 会打印一个加载该图片的DOM
            console.log(element);
          },
          error: function(message) {
            // 当加载图片出现错误时, 会打印错误原因
            console.log(message);
          },
          complete: function() {
            // 当全部图片加载完成时, 会弹出弹窗
            alert('All images have been downloaded successful!');
          }
        });
        ```
    
    * toFrameObservable

        当图片刷新时, 每一帧都会生产一个事件.
        
        ```javascript
        mgr.toFrameObservable.subscribe({
          next: function(status) {
            // 当用户操作时, 会打印当前图片状态
            console.log(status);
          },
          error: function(message) {
            // 当显示图片出现错误时, 会打印错误原因
            console.log(message);
          }
        });
        ```
        
        图片状态结构:
        ```
        status {
            // 图片位置坐标
            offsetX?: number;
            offsetY?: number;
            
            // 缩放
            scale: number;
            
            // 亮度
            brightness: number;
            
            // 对比度
            contrast: number;
        }
        ```


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
