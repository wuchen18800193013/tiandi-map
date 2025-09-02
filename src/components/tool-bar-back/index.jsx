import { useContext } from 'react';
import { Button } from 'antd';
import Icon from '@lc/rc-icon';
import styled from 'styled-components';
import TiandiMapContext from '../../context/tiandi-map';

const RnButton = styled(Button)`
  margin-right: 8px;
`;

/**
 * 地图返回按钮组件
 * 提供返回上一级地图视图的功能
 * @returns {JSX.Element} 返回一个 Button 组件
 */
const ToolBarBack = () => {

  const { handleBack } = useContext(TiandiMapContext);

  return (
    <RnButton {...{
      icon: <Icon type="back" />,
      onClick: handleBack,
    }} />
  );
};

export default ToolBarBack;
