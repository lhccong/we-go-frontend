import {ProLayoutProps} from '@ant-design/pro-components';

/**
 * 默认设置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#FFA768',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '微狗🐶',
  logo: 'https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813',
  pwa: true,
  // iconfontUrl: 'https://img1.baidu.com/it/u=2452283928,895358163&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1706288400&t=501138dfe84a1f06f0b9e99a83032726',
  token: {

    header: {
      // heightLayoutHeader: 78,
      colorTextMenuSelected: '#FFA768',

    },
    sider: {
      colorTextMenuSelected: '#FFA768',
    },
  },
};

export default Settings;
