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
 * 截图工具栏组件
 * 提供截图功能，点击按钮触发截图操作
 * @returns {JSX.Element} 返回截图按钮组件 
 **/
const ToolBarScreenshot = () => {

  /**
   * 使用 TiandiMapContext 获取截图处理函数
   * @param {function} handleScreenShot 截图处理函数
   * @param {string} screenshotLabel 截图提示标签
   **/
  const { handleScreenShot, screenshotLabel } = useContext(TiandiMapContext);

  return (
    <RnButton {...{
      icon: <Icon type="screenshot" size="m" />,
      onClick: handleScreenShot
    }}>
      {screenshotLabel}
    </RnButton>
  );
};

export default ToolBarScreenshot;