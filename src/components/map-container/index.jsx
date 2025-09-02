import { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import Cropper from '@lc/rc-cropper';
import gcoord from 'gcoord';
import styled from 'styled-components';
import 'cropperjs/dist/cropper.css';
import { JSAPI_URL, TRAFFIC_LAYER_URL, INITIAL_RESOLUTION, AMAP_SEARCH_URL } from '../../constant';
import TiandiMapContext from '../../context/tiandi-map';
import ToolBarSearch from '../tool-bar-search';
import ToolBarBack from '../tool-bar-back';
import ToolBarScreenshot from '../tool-bar-road-screenshot';
import ToolBarRoadNet from '../tool-bar-road-net';
import ToolBarLayerSwitch from '../tool-bar-layer-switch';
import "./index.css";

const { transform, WGS84, GCJ02 } = gcoord;

// 截图状态下隐藏地图控件，标注，操作按钮等
const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  .tdt-marker-pane, .tdt-control, .tdt-label, .tdt-toolbar, .tdt-infoWindow-pane, .tdt-_w-pane, .tdt-luopan{
    visibility: ${props => props.$screenshotstart === 'true' ? 'hidden !important' : 'inherit'};
  }
`;

/**
 * 地图容器组件
 * @param {string} location 当前位置名称
 * @param {Array} coords 当前位置经纬度坐标
 * @param {number} zoom 地图缩放级别
 * @param {string} width 地图宽度
 * @param {string} height 地图高度
 * @param {Array} layers 地图图层类型
 * @param {string} markLabel 标记按钮文字
 * @param {string} screenshotLabel 截图按钮文字
 * @param {string} defaultView 默认地图视图类型
 * @param {boolean} defaultRoadNetVisible 默认道路网图层是否可见
 * @param {function} onError 错误回调函数
 * @param {function} onMark 标记回调函数
 * @param {function} onBack 返回回调函数
 * @param {function} onScreenshot 截图回调函数
 * @returns {JSX.Element}
 */
const TiandiMap = (props) => {

  const {
    location: propsLocation = '北京市东城区东华门街道长安街天安门广场',
    coords = [116.39757095128911, 39.906971206155454],
    markLabel = '选择此处为目标地址',
    screenshotLabel = '截图',
    layers = [],
    defaultRoadNetVisible,
    defaultView,
    onError,
    onMark,
    onBack,
    onScreenshot,
  } = props;

  // 引用地图容器和地图实例
  // 使用 useRef 来获取 DOM 元素和存储地图实例
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  // const T = window.T || null;

  const [map, setMap] = useState(null); // 地图实例
  const [searchLoading, setSearchLoading] = useState(false); // 搜索状态
  const [searchKeywords] = useState(propsLocation); // 搜索关键词
  const [location, setLocation] = useState(propsLocation);  // 当前位置名称
  const [showController, setShowController] = useState(false);  // 当前位置名称
  const [searchResultList, setSearchResultList] = useState([]); // 搜索结果列表
  const [roadNet, setRoadNet] = useState(defaultRoadNetVisible ?? false); // 道路网图层是否可见
  const [position, setPosition] = useState(transform(coords, GCJ02, WGS84)); // 当前位置经纬度坐标
  const [screenshotStart, setScreenshotStart] = useState(false);  // 是否开启截图状态
  const [screenShotImg, setScreenShotImg] = useState(''); // 截图图片数据
  const [mapLoading, setMapLoading] = useState(true);  // 全局加载状态
  const [loadingTxt, setLoadingTxt] = useState('地图初始化中');  // 全局加载状态
  const [layer, setLayer] = useState(defaultView || layers?.[0] || 'satellite'); // 当前地图图层类型

  useEffect(() => {
    // 检查是否已加载天地图API
    if (window.T) {
      // 初始化地图
      initMap();
      return;
    }
    // 动态加载天地图API
    const script = document.createElement('script');
    script.src = JSAPI_URL;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => {
      if (onError) onError('Failed to load Tianditu API');
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
      // 清理地图实例
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /**
   * 组件加载完成后，添加地图控件和右键菜单
   **/
  useEffect(() => {
    if (!map) return;
    setMapLoading(false);
    // 添加控件
    addControls();
    // 添加右键菜单
    addMenu();
    // 如果初始化有标记地址，把标记地址画在地图上
    if (position && position.length === 2) drawerMarker();
    // 如果初始化有搜索关键词，执行搜索
    if (searchKeywords) handleSearchLocation(searchKeywords);
    // 如果初始化有路网，执行添加路网
    if (roadNet) addRouteNet();
  }, [map]);

  /**
   * 坐标发生变化时，重绘标记
   * @param {Array} position 当前位置经纬度坐标
   * @param {string} location 当前位置中文描述
   **/
  useEffect(() => {
    if (!map || !position || !location) return;
    drawerMarker();
  }, [position, location]);

  /**
   * 地图添加标记
   * @param {Array} lonlat 经纬度数组 [经度, 纬度]
   * @param {string} labelName 标记名称 如果没有传入 labelName，则使用 location 或默认名称 '目标地址'
   **/
  const drawerMarker = () => {
    // 清除之前的标记
    map.clearOverLays();
    const newMarker = new window.T.Marker({ lat: position[1], lng: position[0] });
    map.addOverLay(newMarker);
    const markerInfoWin = new T.InfoWindow(location || '目标地址', { closeIcon: false });
    newMarker.openInfoWindow(markerInfoWin);
  }

  /**
   * 初始化地图
   * 检查 mapContainerRef 是否存在，若不存在则返回 
   **/
  const initMap = () => {
    if (!mapContainerRef.current) return;
    try {
      // 初始化地图
      const map = new window.T.Map(mapContainerRef.current);
      mapInstanceRef.current = map;
      setMap(mapInstanceRef.current);
      // 设置中心点和缩放级别
      const centerPoint = new window.T.LngLat(position?.[0], position?.[1]);
      map.centerAndZoom(centerPoint, 16);
      map.setMapType(layer === '2d' ? window.TMAP_NORMAL_MAP : window.TMAP_SATELLITE_MAP);
      map.setMaxZoom(18);
      // 强制刷新地图以确保正确渲染
      setTimeout(() => {
        map.centerAndZoom(centerPoint, 16);
        map.setMapType(layer === '2d' ? window.TMAP_NORMAL_MAP : window.TMAP_SATELLITE_MAP);
        if (roadNet && layer === 'satellite') {
          // 使用天地图道路网服务URL创建自定义图层对象
          const roadNetLayer = new T.TileLayer(TRAFFIC_LAYER_URL);
          // 将图层增加到地图上
          roadNetLayer.id = 'roadNetLayer';
          map.addLayer(roadNetLayer);
        };
        map.setMaxZoom(18);

      }, 100);

    } catch (error) {
      console.error('地图初始化失败', error);
      if (onError) onError(error.message);
    }
  };

  /**
   * 删除a标签的href=# 
   **/
  const deleteAHref = () => {
    document.querySelectorAll('a[href="#"]').forEach(a => {
      a.removeAttribute('href');
    });
  }

  /**
   * 地图加载完之后添加地图控件
   **/
  const addControls = () => {
    const scaleControl = new window.T.Control.Scale({ position: 'bottomright', imperial: false, updateWhenIdle: false });
    const zoomControl = new window.T.Control.Zoom({ position: 'bottomright' });
    map.addControl(scaleControl);
    map.addControl(zoomControl);
    setShowController(true);
  }

  /**
   * 地图添加右键菜单
   **/
  const addMenu = () => {
    if (!onMark && !onScreenshot) return;
    setTimeout(() => {
      try {
        // 添加右键菜单
        const menu = new window.T.ContextMenu({
          width: 150
        });
        if (onMark) {
          const markHereItem = new window.T.MenuItem(markLabel, handleAddMarker);
          menu.addItem(markHereItem);
        }
        if (onScreenshot) {
          const screenShotItem = new window.T.MenuItem(screenshotLabel, handleScreenShot);
          menu.addItem(screenShotItem);
        }
        map.addContextMenu(menu);
      } catch (error) {
        console.error('添加右键菜单失败', error);
        if (onError) onError(error.message);
      } finally {
        deleteAHref();
      }
    }, 300);
  };

  /**
   * 添加标记功能
   * @param {Object} lonlat 经纬度对象 { lng: 经度, lat: 纬度 }
   **/
  const handleAddMarker = (lonlat) => {
    setPosition([lonlat?.lng, lonlat?.lat]);
    const positionGCJ02 = transform([lonlat?.lng, lonlat?.lat], WGS84, GCJ02);
    // 使用天地图逆地理编码服务
    const geocoder = new window.T.Geocoder();
    geocoder.getLocation(lonlat, (res) => {
      if (res && res.addressComponent) {
        setLocation(res.formatted_address || '目标地址');
        setTimeout(() => {
          if (onMark) onMark(positionGCJ02, res.formatted_address);
        }, 500);
      } else {
        // 如果没有获取到地址信息，仍然返回经纬度
        if (onMark) onMark(positionGCJ02);
      }
    });
  };

  /**
   * 搜索位置功能
   * @param {string} keyword 搜索关键词
   **/
  const handleSearchLocation = (keyword) => {
    setSearchLoading(true);
    if (!map || !keyword) return;
    fetch(`${AMAP_SEARCH_URL}${encodeURIComponent(keyword)}`)
      .then(response => response.json())
      .then(data => {
        if (!data?.pois?.length) return;
        setSearchLoading(false)
        setSearchResultList(data.pois.map(poi => ({
          id: poi.id,
          name: poi.name,
          lonlat: transform(poi.location.split(','), GCJ02, WGS84),
        })));
      })
      .catch(error => {
        setSearchLoading(false)
        console.error('地址查询失败', error);
      });
  };

  /**
   * 选择搜索结果之后
   * @param {Object} poi 选中的搜索结果对象
   **/
  const handleSelectSearchResult = (poi) => {
    if (poi) {
      const position = poi?.lonlat;
      if (position?.length !== 2) return;
      const centerPoint = new window.T.LngLat(position[0], position[1]);
      map.centerAndZoom(centerPoint, 16);
      setPosition(position);
      setLocation(poi?.name);
    }
  }

  /**
   * 切换地图图层
   * @param {string} value 图层类型 '2d' 或 'satellite
   **/
  const handleSetLayer = (value) => {
    setLayer(value);
    map.setMapType(value === '2d' ? window.TMAP_NORMAL_MAP : window.TMAP_SATELLITE_MAP);
    if (roadNet) addRouteNet(value);
  }

  /**
   * 点击路网按钮
   **/
  const handleSetRoutNet = () => {
    const newStateRoudNet = !roadNet;
    setRoadNet(newStateRoudNet);
    // 添加或移除道路要素服务图层
    if (newStateRoudNet) {
      addRouteNet();
    } else {
      deleteRouteNet();
    }
  }

  /**
   * 地图添加路网视图
   **/
  const addRouteNet = (propslayer) => {
    deleteRouteNet();
    // 2d视图不添加路网
    const currentLayer = propslayer || layer;
    if (currentLayer === '2d') return;
    // 使用天地图道路网服务URL创建自定义图层对象
    const roadNetLayer = new T.TileLayer(TRAFFIC_LAYER_URL);
    // 将图层增加到地图上
    roadNetLayer.id = 'roadNetLayer';
    map.addLayer(roadNetLayer);
  }

  /**
   * 地图删除路网视图
   **/
  const deleteRouteNet = () => {
    if (!map) return;
    // 获取地图上所有图层
    const layers = map.getLayers();
    // 查找并移除道路网图层
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].id === 'roadNetLayer') {
        map.removeLayer(layers[i]);
      }
    }
  }

  /**
   * 点击截屏按钮
   * 使用 html2canvas 截图当前地图容器
   **/
  const handleScreenShot = async () => {
    setScreenshotStart(true);
    setScreenShotImg('');
    setLoadingTxt('');
    setMapLoading(true);
    map.clearOverLays();

    // 使用 html2canvas 来截图
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return;
    const html2canvas = (await import('html2canvas')).default;
    html2canvas(mapContainer, {
      useCORS: true,
      allowTaint: true,
      scale: 1 // 提高截图质量
    }).then(canvas => {
      setMapLoading(false);
      // 将截图转换为图片数据
      const imageUrl = canvas.toDataURL('image/png');
      setScreenShotImg(imageUrl);
    }).catch(error => {
      setMapLoading(false);
      console.error('截图失败:', error);
      if (onError) onError('截图失败');
    });
  }

  /**
   * 计算当前地图缩放级别下100像素对应的地理距离
   * @returns {number} 100像素对应的地理距离值
   */
  const get100pxScale = () => {
    // 将纬度转换为弧度
    const latRad = position?.[1] * Math.PI / 180;
    // 当前缩放级别的分辨率
    return 100000 * INITIAL_RESOLUTION * Math.cos(latRad) / Math.pow(2, map.getZoom());
  }

  /**
   * 截图结束处理函数
   * @param {string} imageData - 截图的图像数据，通常为base64编码的图片字符串
   * @returns {void} 截图成功之后的回调
   */
  const screenShotEnd = (imageData) => {
    setScreenshotStart(false);
    drawerMarker();
    if (onScreenshot) {
      const result = onScreenshot({
        imageData,
        northArrow: 0,
        scale: get100pxScale(),
      });
      if (result?.then) {
        setMapLoading(true);
        result.finally(() => setMapLoading(false));
      }
    }
  }

  return (
    <TiandiMapContext.Provider
      value={{
        searchLoading, // 搜索状态
        searchKeywords, // 搜索关键词
        searchResultList, // 搜索结果列表
        layer,  // 当前地图图层类型
        layers, // 地图图层类型列表
        roadNet,  // 道路网图层是否可见
        screenshotLabel,  // 截图按钮和菜单文字
        handleSearchLocation, // 搜索位置功能
        handleSelectSearchResult, // 选择搜索结果
        handleSetLayer, // 切换地图图层
        handleSetRoutNet, // 切换道路网图层
        handleScreenShot, // 截图功能
        handleBack: () => { if (onBack) onBack() }, // 返回功能
      }}
    >

      {screenshotStart && screenShotImg ? <Cropper
        zIndex={1000}
        imageUrl={screenShotImg}
        onCancel={() => {
          setScreenshotStart(false);
          drawerMarker();
        }}
        onConfirm={screenShotEnd}
      /> : null}

      <Spin fullscreen spinning={mapLoading} tip={loadingTxt} />

      <div className='map-container'>
        <MapContainer
          $screenshotstart={`${screenshotStart}`}
          ref={mapContainerRef}
        >
          <div className="tdt-toolbar">
            <div className="tdt-toolbar-left">
              {onBack ? <ToolBarBack /> : ''}
              <ToolBarSearch />
            </div>
            <div className="tdt-toolbar-right">
              {onScreenshot ? <ToolBarScreenshot /> : ''}
              {(layer === 'satellite' && layers.includes('road-net')) ? <ToolBarRoadNet /> : ''}
              <ToolBarLayerSwitch />
            </div>
          </div>

          {showController ? <div className="tdt-luopan">
            <div className="tdt-compass">
              <div className="tdt-pointers" />
            </div>
            <div className="tdt-pitchUp" />
            <div className="tdt-pitchDown" />
          </div> : ''}
          
        </MapContainer>
      </div>

    </TiandiMapContext.Provider>
  )
};

export default TiandiMap;