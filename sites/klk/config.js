import VAR from '@src/util/VAR'
import themes from '@src/style/theme'

export default {
  title: 'Welcome',
  theme: 'deepred',
  themes,
  name: 'amxpj', // 站点代码(文件夹)
  setName: '澳门新葡京',
  activityStatus: true, // 活动是否开启
  activityType: '',
  // preview: true,
  autoDownload: {
    android: true,
    ios: false
  }, // 自动下载而不进入下载页
  gameType: [], // 游戏类型
  home: VAR.HOME.QP, // 首页主题 C版面
  newQP :true, //新版棋牌 主题色改为黄色 必须首页主题为QP使用
  agentCenter: VAR.AGENTCENTER.NEW, // 代理中心主题
  homeImgAlert: true, // 首页图片弹窗是否启用
  homeImgAlertCloseTime: 7, // 首页图片弹窗自动关闭时间
  imgAlertCloseSizeStyle: { // 首页图片弹窗关闭区域位置
    top: '0',
    right: '0',
    width: '1rem',
    height: '1rem'
  },
  defaultTheme: VAR.THEME.DEFAULT, // 默认主题颜色
  k3Theme: VAR.K3.TC, // 快三主题
  betInputTheme: VAR.INPUT.CHIP, // 下注输入框主题
  downloadTheme: VAR.DOWNLOAD.AMXPJ, // 下载页主题
  download: { // 原生下载地址
    ios: '',
    android: ''
  },
  agentInfo: {
    type: '',
    info: ''
  },
  lotteryPay: true, // 彩票投注页面不显示去充值按钮
  newGame: true, // 新版游戏
  newSlide: true, // 新版侧边栏
  newSports: true, // 新版体育
  newInvite: true, // 新版邀请好友
  newLive: true, //新版真人视讯
  // homeLogin: true // 首页登陆
  showRedPacket:false,//红包雨
  activeShowJgjCont: true, //活动页面金管家tab下的活动直接显示内容
}
