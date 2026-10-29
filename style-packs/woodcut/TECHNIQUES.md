# 木刻版画 · 绘制接入

保留原独立绘制模块及其本地依赖闭包。 入口：`engine/engine/index.js`。

视觉合同：黑木块、顺形刀刻排线、刀口毛边和分版印刷。

依赖：webgl2。目录可发现不代表这些条件已就绪。

## 可用接口

- `engine/engine/filter.js`：`woodcutFilter`。
- `engine/engine/hatch.js`：`Region`, `light`, `reliefTone`, `dirAngle`, `dirRadial`, `dirRing`, `dirContour`, `hatch`, `lines`。
- `engine/engine/index.js`：`INK`, `canvas`, `pathOf`, `fillPoly`, `offsetPoly`, `cutAlong`, `flecks`, `rays`, `shape`, `plate`, `ellipse`, `rect`。
- `engine/engine/knife.js`：`mkStroke`, `resample`, `spline`, `strokePath`, `progOf`, `drawStrokes`, `chip`, `strokeBounds`, `xform`。
- `engine/engine/print.js`：`makePrinter`。



## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。新片自行设计题材对象、角色和构图。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
