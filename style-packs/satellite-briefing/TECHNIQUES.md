# 卫星简报 · 绘制技法

engine/engine.js 保留原地球相机、坐标投影、嵌套纹理、影像分级和 WebGL2 shader；overlay.js 保留测量标记。影像必须本地预载入并提供真实经纬度 bbox；技术网格只用于测试。

可用入口：`engine/engine.js`。关键接口：`Engine`, `makeCamera`, `project`, `unproject`, `kmPerPx`。

依赖：webgl2, georeferenced-imagery。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-satellite-briefing；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
