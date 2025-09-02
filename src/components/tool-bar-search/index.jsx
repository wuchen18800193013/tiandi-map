import { useState, useContext, useCallback } from 'react';
import { Input, Dropdown } from 'antd';
import styled from 'styled-components';
import {
  mixinTypoEllipsis,
  mixinBgSecondary,
  mixinTextTertiary
} from '@lc/fork-console-base-theme';
import TiandiMapContext from '../../context/tiandi-map';

const ScInputSearch = styled(Input.Search)`
  width: 320px;
  .ant-input {
    font-size: 12px !important;
  }
`;
const ScDropdown = styled.div`
  margin: 2px 0 0 -12px;
  padding: 4px;
  width: 320px;
  background-color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
`;
const ScDropdownItem = styled.div`
  padding: 4px 8px;
  cursor: pointer;
  ${mixinTypoEllipsis}
  
  &:hover {
    ${mixinBgSecondary}
  }
`;
const ScLoadingOrEmpty = styled.div`
  padding: 4px 8px;
  ${mixinTextTertiary}
`;

/**
 * 搜索工具栏组件
 * 支持输入搜索关键词，显示搜索结果列表
 * @returns {JSX.Element} 返回搜索输入框和下拉结果列表 
 **/
const ToolBarSearch = () => {

  /**
   * 使用 TiandiMapContext 获取搜索相关状态和函数
   * @param {string} searchKeywords 当前搜索关键词
   * @param {boolean} searchLoading 是否正在加载搜索结果
   * @param {Array} searchResultList 搜索结果列表
   * @param {function} handleSelectSearchResult 选择搜索结果的函数
   * @param {function} handleSearchLocation 执行搜索的函数 
   **/
  const {
    searchKeywords,
    searchLoading,
    searchResultList,
    handleSelectSearchResult,
    handleSearchLocation,
  } = useContext(TiandiMapContext);

  const [openDropdown, setOpenDropdown] = useState(false);

  /**
   * 处理下拉菜单的显示状态
   * @param {boolean} value 是否打开下拉菜单 
   **/
  const handleDropdownVisibleChange = useCallback((value) => {
    setOpenDropdown(value);
  }, [setOpenDropdown]);

  /**
   * 处理搜索输入框的搜索事件
   * 如果输入不为空，则调用 handleSearchLocation 执行搜索 
   * @param {string} e 输入的搜索关键词
   **/
  const handleSearch = (e) => {
    if (e?.trim()) {
      handleSearchLocation(e.trim());
      setOpenDropdown(true);
    }
  };

  /**
   * 处理输入框的输入事件
   * 打开下拉菜单以显示搜索结果
   **/
  const handleInput = () => {
    setOpenDropdown(true);
  };

  /**
   * 渲染下拉菜单内容
   * 如果正在加载，则显示加载中提示
   * 如果有搜索结果，则显示结果列表
   * 如果没有结果，则显示未找到提示
   * @returns {JSX.Element} 返回下拉菜单内容 
   **/
  const renderDropdown = useCallback(() => {
    if (searchLoading) {
      return <ScDropdown>
        <ScLoadingOrEmpty>搜索中...</ScLoadingOrEmpty>
      </ScDropdown>;
    }
    if (searchResultList?.length) {
      return <ScDropdown>
        {searchResultList.map(poi => 
          <ScDropdownItem
            key={poi.id}
            onClick={() => {
              handleSelectSearchResult(poi);
            }}
          >
            {poi.name}
          </ScDropdownItem>
        )}
      </ScDropdown>;
    }
    return <ScDropdown>
      <ScLoadingOrEmpty>未找到相关结果</ScLoadingOrEmpty>
    </ScDropdown>;
  }, [searchLoading]);

  return (
    <div className="tiandi-map-search" >
      <Dropdown
        popupRender={renderDropdown}
        open={openDropdown}
        onOpenChange={handleDropdownVisibleChange}
      >
        <ScInputSearch
          allowClear
          placeholder="搜索地点"
          enterButton
          defaultValue={searchKeywords}
          loading={searchLoading}
          onSearch={handleSearch}
          onChange={handleInput}
          onAbort={handleInput}
        />
      </Dropdown>
    </div>
  );
};

export default ToolBarSearch;