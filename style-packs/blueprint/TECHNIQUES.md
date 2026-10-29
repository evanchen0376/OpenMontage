# 蓝图／工程制图 · 绘制技法

engine/draw.js 保留墨线、特效、排印三个画布，engine/paper.js 为原 WebGL2 蓝晒纸合成器。先 clear/setCam，再绘制，最后 makePaper 返回函数合成三个画布。原机件与故事只保存在 reference 中。

可用入口：`engine/draw.js`。关键接口：`makePaper`, `line`, `dim`, `balloon`, `setCam`。

依赖：webgl2。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-blueprint；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
