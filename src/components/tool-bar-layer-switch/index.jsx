import { useContext } from 'react';
import { Radio } from 'antd';
import Icon from '@lc/rc-icon';
import styled from 'styled-components';
import TiandiMapContext from '../../context/tiandi-map';

const ScLabel = styled.span`
  margin-left: 8px;
  font-size: 12px;
`;

/**
 * 切换地图图层组件
 * 支持 2D 和 卫星图层的切换
 * 仅在两种图层都存在时显示
 * @returns {JSX.Element|null} 返回 Radio 组件或 null
 */
const ToolBarLayerSwitch = () => {

  /**
   * 使用 TiandiMapContext 获取当前地图图层和可用图层列表
   * @param {string} layer 当前图层 2d 或 satellite
   * @param {Array} layers 可用图层列表
   * @param {function} handleSetLayer 切换图层的函数
   */
  const {
    layer,
    layers,
    handleSetLayer,
  } = useContext(TiandiMapContext);

  return (layers?.includes('2d') && layers?.includes('satellite')) ? 
    <Radio.Group {...{
      value: layer,
      optionType: 'button',
      buttonStyle: 'solid',
      onChange: e => handleSetLayer(e.target.value)
    }}>
      <Radio value="satellite">
        <Icon type="map-satellite" size="m" />
        <ScLabel>卫星地图</ScLabel>
      </Radio>
      <Radio value="2d">
        <Icon type="map-2d" size="m" />
        <ScLabel>2D 地图</ScLabel>
      </Radio>
    </Radio.Group> : null
};

export default ToolBarLayerSwitch;