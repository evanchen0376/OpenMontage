# 微游戏快闪 · 绘制接入

保留原独立绘制模块及其本地依赖闭包。 入口：`engine/toon.js`。

视觉合同：短指令、回合倒计时、多种媒介切换。

依赖：webgl2。目录可发现不代表这些条件已就绪。

## 可用接口

- `engine/g_ascii.js`：`CW`, `clearAscii`, `rasterize`, `type`, `print`, `cadetAscii`, `testCadet`, `render`, `DOT_ART`, `drawArt`, `sceneStrap`。
- `engine/g_crayon.js`：`CR`, `clearCrayon`, `cline`, `cpoly`, `circlePts`, `hatch`, `cfill`, `knock`, `print`, `ctext`, `cadetCrayon`, `testCadet`, `PUMPS`, `scenePump`。
- `engine/g_ink.js`：`TONE`, `clearInk`, `stroke`, `blot`, `splatter`, `print`, `cadetInk`, `vermilion`, `seal`, `dust`, `brushText`, `sceneSneeze`。
- `engine/g_pixel.js`：`PW`, `C`, `bayer`, `pset`, `fill`, `rect`, `disc`, `present`, `cadetPix`, `meteor`, `DODGE_HITS`, `sceneDodge`, `gull`。
- `engine/g_riso.js`：`clearRiso`, `ink`, `shape`, `C_`, `E_`, `RR`, `print`, `withHalo`, `cadetRiso`, `testCadet`, `sceneCatch`。
- `engine/g_swiss.js`：`SW`, `GRID`, `colX`, `page`, `text`, `cadetSwiss`, `testCadet`, `SAL`, `BOUNCE`, `live7`, `sceneSalute`。
- `engine/glpass.js`：`pass`, `canvas`, `staticTex`。
- `engine/toon.js`：`P`, `K`, `setCtx`, `lw`, `part`, `tube`, `line`, `dot`, `circ`, `ell`, `rrect`, `poly`, `smooth`, `limb`, `outlined`。



## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。新片自行设计题材对象、角色和构图。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
