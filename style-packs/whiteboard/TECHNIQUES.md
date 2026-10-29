# 白板讲解 · 绘制技法

engine/engine/wb.js 保留 Stroke/Timeline/Pen/Board。loadFont 读取 engine/fonts/EMSTech.json（OFL），仅支持该字体字形；中文需要独立笔画库，不能把遮罩横扫伪称逐笔书写。新片自行构造笔画顺序和相机。

可用入口：`engine/engine/wb.js`。关键接口：`Board`, `Timeline`, `Pen`, `Stroke`, `arrow`, `text`。

依赖：浏览器 Canvas 2D。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-whiteboard；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
