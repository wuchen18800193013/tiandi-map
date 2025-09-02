import TiandiMap from '../src/components/map-container/index.jsx';
import './index.css';

export default {
  title: 'components/TiandiMap',
  component: TiandiMap,
  argTypes: {
    mapType: {
      // control: { type: 'radio' },
      // options: ['vector', 'satellite', 'terrain']
    },
    zoom: {
      control: { type: 'range', min: 1, max: 18 }
    }
  }
};

const Template = (args) => <TiandiMap {...args} />;

export const Default = Template.bind({});
Default.args = {
  location: '北京市东城区东华门街道长安街天安门广场',
  coords: [116.39757095128911, 39.906971206155454],
  zoom: 20,
  layers: ['satellite', '2d', 'road-net'],
  markLabel: '选择此处为目标地址',
  screenshotLabel: '截图',
  defaultView: 'satellite',
  defaultRoadNetVisible: true,
  onError: () => {},
  onBack: () => {},
  onMark: () => {},
  onScreenshot: (data) => { console.log('onScreenshot', data); },
};

// 添加 decorators 来确保 API 正确加载
Default.decorators = [
  (Story) => (
    <Story />
  )
];