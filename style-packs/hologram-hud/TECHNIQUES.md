# 科幻全息界面 · 绘制接入

保留原独立绘制模块及其本地依赖闭包。 入口：`engine/engine/holo.js`。

视觉合同：线框扫描、局部展开、引线和滚动参数。

依赖：Canvas 2D。目录可发现不代表这些条件已就绪。

## 可用接口

- `engine/engine/holo.js`：`loadModel`, `prepModel`, `normalizeModel`, `makeCamera`, `Holo`, `drawScanPlane`, `drawPad`, `modelFromPath`。
- `engine/engine/hud.js`：`clamp`, `FONT`, `theme`, `background`, `vignette`, `plate`, `chrome`, `corners`, `targetBox`, `leader`, `rollText`, `monoText`, `fitFont`, `wrap`, `specCard`, `chip`, `subtitle`, `glitch`, `marker`, `beam`。



## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。新片自行设计题材对象、角色和构图。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
