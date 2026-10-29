# 工程简报板 · 绘制技法

engine/kit/board.js 是原完整数据驱动白板引擎。setScene 接受 board/cam/elements/subs；print 元素按 kit/objects/<id>.json 和 .png 读取真实照片及元数据，新片须提供这些文件。可调用 setAssetBase(url) 指向项目自有公共素材根目录（含 objects/、fonts/），避免 Remotion 编译位置改变素材路径。字体在项目中自托管，调用 loadFonts。

可用入口：`engine/kit/board.js`。关键接口：`setScene`, `renderScene`, `camAt`, `sceneTexts`。

依赖：licensed-object-photos。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-briefing-board；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
