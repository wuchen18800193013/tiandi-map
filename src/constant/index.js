// 天地图apiKey
export const API_KEY = '3fe408caa469e5fad5ade56e5747d574';

// 默认地图缩放级别
export const DEFAULT_ZOOM = 20;

// 天地图jsapi script引入地址
export const JSAPI_URL = `https://api.tianditu.gov.cn/api?v=4.0&tk=${API_KEY}`;

// 交通要素图层服务地址
export const TRAFFIC_LAYER_URL = "https://t0.tianditu.gov.cn/cia_w/wmts?" +
      "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
      `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${API_KEY}`;

// 赤道处缩放级别0的分辨率（米/像素）
export const INITIAL_RESOLUTION = 156543.03392;

// 高德地址查询api
export const AMAP_SEARCH_URL = "https://restapi.amap.com/v3/place/text?platform=JS&s=rsv3&logversion=2.0&key=20c23b923751dbb6a343f595c008929b&sdkversion=2.0.6.4&csid=F2F97F0B-77B7-4712-BA18-7308EBF5CCF4&jscode=17da8e4d4f32c3fa918214c73c39d3e7&city=%E5%85%A8%E5%9B%BD&page=1&offset=10&extensions=complete&language=zh_cn&s=rsv3&children=&type_=KEYWORD&antiCrab=true&keywords=";