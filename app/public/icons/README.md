# 图标文件说明

请将应用图标放置在此目录下，需要以下尺寸：

## 必需的图标尺寸

- `icon-72x72.png` (72x72 像素)
- `icon-96x96.png` (96x96 像素)
- `icon-128x128.png` (128x128 像素)
- `icon-144x144.png` (144x144 像素)
- `icon-152x152.png` (152x152 像素)
- `icon-192x192.png` (192x192 像素)
- `icon-384x384.png` (384x384 像素)
- `icon-512x512.png` (512x512 像素)
- `badge-72x72.png` (72x72 像素，推送通知角标)

## 设计建议

- 使用简洁、识别度高的图标
- 背景色建议使用品牌色（如 #007AFF）
- 图标主体留白至少 10%
- 支持透明背景
- 使用 PNG 格式

## 快速生成

可以使用以下工具快速生成各种尺寸的图标：

1. **在线工具**：
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

2. **命令行工具**：
   ```bash
   npm install -g pwa-asset-generator
   pwa-asset-generator your-icon.png ./icons
   ```

## 临时占位图标

在开发阶段，可以使用纯色占位图标：

```bash
# 使用 ImageMagick 生成占位图标
convert -size 512x512 xc:#007AFF icon-512x512.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
# ... 以此类推
```
