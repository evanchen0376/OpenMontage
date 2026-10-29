# 档案灯台 · 绘制技法

engine/primitives.js 实现背光台、原比例档案摆放和光学放大镜。当前为平面文档 Canvas 适配，原 WebGL 负片转正和照片深度未完成解耦，完整源码保留供后续适配。

可用入口：`engine/primitives.js`。关键接口：`lightTable`, `archiveObject`, `loupe`。

依赖：licensed-archive-scans。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-archive-lighttable；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
