import { useContext } from 'react';
import { Button } from 'antd';
import Icon from '@lc/rc-icon';
import styled from 'styled-components';
import TiandiMapContext from '../../context/tiandi-map';

const RnButton = styled(Button)`
  margin-right: 8px;
  font-size: 12px;
`;

/**
 * 路网显示切换组件
 * 仅在路网图层存在时显示
 * @returns {JSX.Element|null} 返回路网切换按钮或 null 
 **/
const ToolBarRoadNet = () => {

  /**
   * 使用 TiandiMapContext 获取当前路网图层状态和可用图层列表
   * @param {Array} layers 可用图层列表
   * @param {boolean} roadNet 当前路网图层是否显示
   * @param {function} handleSetRoutNet 切换路网图层
   **/
  const {
    layers,
    roadNet,
    handleSetRoutNet,
  } = useContext(TiandiMapContext);

  return layers?.includes("road-net") ? 
    <RnButton {...{
      icon: <Icon type="map-road-net" size="m" />,
      type: roadNet ? 'primary' : 'default',
      onClick: handleSetRoutNet
    }}
    >
      路网
    </RnButton> : null;
};

export default ToolBarRoadNet;