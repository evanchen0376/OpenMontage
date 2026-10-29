# 复古半调案卷 · 绘制技法

engine/primitives.js 从原内联页面的纸张、半调、套印和印章技法适配为 Canvas。它不包含原猫角色、剧情和固定画面。印章建议在独立透明图层绘制，再合成到纸面。

可用入口：`engine/primitives.js`。关键接口：`paper`, `halftone`, `stamp`, `registration`。

依赖：浏览器 Canvas 2D。这些是能力要求，不代表当前机器已通过预检。

引擎使用说明与源码应结合阅读；原始路径按 reference/source 对照，原第三方清单在 reference/CREDITS。`../../shared` 指向同一风格库的通用机械层，materialize 会保留相对结构。

项目必须单独创建绘制入口，提供 `create(canvas) -> {render(seconds), dispose?}`，在初始化中预载入本地字体与素材，render 仅依赖时间和固定数据。使用 shared/RemotionDrawing.tsx 或 shared/hyperframes.js 连接已批准的运行时。不要直接执行 reference/source 的样片。

技术预览：浏览器打开 examples/finance.html?pack=lemo-halftone-dossier；它使用明确标注的合成测试数据，不是生产模板或财经事实样片。
