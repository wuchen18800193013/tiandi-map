# 天地图 React 组件

基于 React + Vite 开发的天地图组件，使用天地图 API 进行地图展示。

## 功能特性

- 基于天地图 API 实现的地图组件
- 支持多种地图类型（矢量、卫星、地形）
- 可自定义中心点和缩放级别
- 支持自定义宽高
- 集成 Storybook 用于组件预览

## 安装

### 通过 npm 安装
\`\`\`bash
npm install tiandi-map
\`\`\`

### 通过 yarn 安装
\`\`\`bash
yarn add tiandi-map
\`\`\`

## 使用方法

### 作为 React 组件使用
\`\`\`jsx
import TiandiMap from 'tiandi-map';
import 'tiandi-map/dist/style.css';

function App() {
  return (
    <TiandiMap 
      center={[116.404, 39.915]} 
      zoom={10} 
      height="500px" 
    />
  );
}
\`\`\`

### 在浏览器中直接使用
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/tiandi-map/dist/style.css">
</head>
<body>
  <div id="map-container"></div>
  
  <!-- 引入 React 和 ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- 引入 TiandiMap 组件 -->
  <script src="https://unpkg.com/tiandi-map/dist/tiandi-map.umd.js"></script>
  
  <script>
    const root = ReactDOM.createRoot(document.getElementById('map-container'));
    root.render(
      React.createElement(TiandiMap, {
        center: [116.404, 39.915],
        zoom: 10,
        height: '500px'
      })
    );
  </script>
</body>
</html>
\`\`\`

## 开发

### 安装依赖
\`\`\`bash
npm install
# 或
yarn install
\`\`\`

### 启动 Storybook (推荐)
\`\`\`bash
npm run storybook
# 或
yarn storybook
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

### 构建项目
\`\`\`bash
npm run build
# 或
yarn build
\`\`\`

## 组件属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| apiKey | string | '3fe408caa469e5fad5ade56e5747d574' | 天地图API密钥 |
| center | [number, number] | [116.404, 39.915] | 地图中心点经纬度 |
| zoom | number | 10 | 地图缩放级别 |
| width | string | '100%' | 地图容器宽度 |
| height | string | '400px' | 地图容器高度 |
| mapType | 'vector' \| 'satellite' \| 'terrain' | 'vector' | 地图类型 |
| onLoad | function | undefined | 地图加载完成回调 |
| onError | function | undefined | 地图加载错误回调 |