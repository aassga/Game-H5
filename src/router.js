import Vue from 'vue'
import Router from 'vue-router'
import * as pages from './pages'
import './style/reset.css'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) { return originalPush.call(this, location).catch(err => err) }
export default new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: pages.Home,
      meta: {
        tab: true,
        index: 0
      }
    },
    {
      path: '/admin/login',
      name: 'login',
      component: pages.Login,
      meta: {
        tab: false,
        index: 1
      }
    },
    {
      path: '/admin/login-default',
      name: 'login-default',
      component: pages.loginDefault,
      meta: {
        tab: false,
        index: 1
      }
    },
    {
      path: '/admin/c-login',
      name: 'c-login',
      component: pages.CLogin,
      meta: {
        tab: true,
        index: 1
      }
    },
    {
      path: '/admin/amhg-login',
      name: 'amhg-login',
      component: pages.amhgLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/aqvns-login',
      name: 'aqvns-login',
      component: pages.aqvnsLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/betnew-login',
      name: 'betnew-login',
      component: pages.betnewLocgin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/Blr-login',
      name: 'Blr-login',
      component: pages.BlrLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/Blush-login',
      name: 'Blush-login',
      component: pages.BlushLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/cpxpj-login',
      name: 'cpxpj-login',
      component: pages.cpxpjLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/etnqp-login',
      name: 'etnqp-login',
      component: pages.etnqpLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/fhcp-login',
      name: 'fhcp-login',
      component: pages.fhcpLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/kyqp-login',
      name: 'kyqp-login',
      component: pages.kyqpLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/newqp-login',
      name: 'newqp-login',
      component: pages.newqpLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/tccp-login',
      name: 'tccp-login',
      component: pages.tccpLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/vns-login',
      name: 'vns-login',
      component: pages.VnsLogin,
      meta: {
        tab: false,
        index: 3
      }
    },
    {
      path: '/admin/vnso-login',
      name: 'vnso-login',
      component: pages.vnsoLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/Vnst-login',
      name: 'Vnst-login',
      component: pages.VnstLogin,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/Vnst2-login',
      name: 'Vnst2-login',
      component: pages.VnstLogin2,
      meta: {
        tab: false,
        index: 2
      }
    },
    {
      path: '/admin/register',
      name: 'register',
      component: pages.Register,
      meta: {
        tab: false,
        index: 5
      }
    },
    {
      path: '/home/type/:id',
      component: pages.Type,
      props: true,
      meta: {
        tab: false,
        index: 6
      }
    },
    {
      path: '/home/type',
      component: pages.Type,
      meta: {
        tab: false,
        index: 7
      }
    },
    {
      path: '/home/game/:id',
      component: pages.GameList,
      props: true,
      meta: {
        tab: false,
        index: 8
      }
    },
    {
      path: '/home/game',
      component: pages.GameList,
      meta: {
        tab: false,
        index: 9
      }
    },
    {
      path: '/user',
      component: pages.User,
      meta: {
        tab: true,
        index: 10
      }
    },
    {
      path: '/save',
      component: pages.Save,
      meta: {
        tab: true,
        index: 11
      }
    },
    {
      // 支付宝，微信转账
      path: '/save/saveDeposit',
      component: pages.SaveDeposit,
      meta: {
        tab: false,
        index: 12
      }
    },
    {
      path: '/save/:type/:id',
      props: true,
      component: pages.SaveSubmit,
      meta: {
        tab: false,
        index: 12
      }
    },
    {
      path: '/save/sutomerSaveList',
      props: true,
      component: pages.sutomerSaveList,
      meta: {
        tab: false,
        index: 12
      }
    },
    {
      path: '/about',
      component: pages.About,
      name: 'about',
      meta: {
        tab: false,
        index: 14
      }
    },
    
    {
      path: '/user/message',
      component: pages.Message,
      meta: {
        tab: false,
        index: 15
      }
    },
    {
      path: '/user/report',
      component: pages.Report,
      meta: {
        tab: false,
        index: 16
      }
    },
    {
      path: '/take',
      component: pages.Take,
      meta: {
        tab: false,
        index: 17
      }
    },
    {
      path: '/user/info',
      component: pages.UserInfo,
      meta: {
        tab: false,
        index: 18
      }
    },
    {
      path: '/user/edit/:type/:tab',
      component: pages.BaseEditor,
      props: true,
      meta: {
        tab: false,
        index: 19
      }
    },
    {
      path: '/user/edit/:type',
      component: pages.BaseEditor,
      props: true,
      meta: {
        tab: false,
        index: 20
      }
    },
    {
      path: '/user/cardedit',
      component: pages.CardEditor,
      props: true,
      meta: {
        tab: false,
        index: 20
      }
    },
    {
      path: '/user/add-bank',
      component: pages.AddBank,
      meta: {
        tab: false,
        index: 21
      }
    },
    {
      path: '/user/add-usdt',
      component: pages.AddUsdt,
      meta: {
        tab: false,
        index: 21
      }
    },
    {
      // 代理中心
      path: '/user/agency-center',
      component: pages.AgencyCenter,
      meta: {
        tab: false,
        index: 22
      }
    },
    {
      // 代理中心
      path: '/user/money-rule',
      component: pages.MoneyRule,
      meta: {
        tab: false,
        index: 23
      }
    },
    {
      path: '/user/money-rule-app',
      component: pages.MoneyRule,
      meta: {
        tab: false,
        index: 24
      }
    },
    {
      // 代理收益
      path: '/user/agent/income',
      component: pages.AgentIncome,
      meta: {
        tab: false,
        index: 25
      }
    },
    {
      // 代理收益详情
      path: '/user/agent/income/:date',
      component: pages.AgentIncomeInfo,
      props: true,
      meta: {
        tab: false,
        index: 26
      }
    },
    {
      // 代理报表
      path: '/user/agent/report',
      component: pages.AgentReport,
      meta: {
        tab: false,
        index: 27
      }
    },
    {
      // 下级开户
      path: '/user/agent/open',
      component: pages.AgentOpen,
      meta: {
        tab: false,
        index: 28
      }
    },
    {
      // 下级开户赔率编辑
      path: '/user/agent/open/odds/:type/:readonly',
      props: true,
      component: pages.AgentOpenOdds,
      meta: {
        tab: false,
        index: 29
      }
    },
    {
      // 下级列表
      path: '/user/agent/list',
      component: pages.AgentList,
      meta: {
        tab: false,
        index: 30
      }
    },
    {
      // 下级列表编辑赔率
      path: '/user/agent/list/edit-odds/:type',
      component: pages.AgentOddsEditor,
      props: true,
      meta: {
        tab: false,
        index: 31
      }
    },
    {
      // 下级财务
      path: '/user/agent/finance',
      component: pages.AgentFinance,
      meta: {
        tab: false,
        index: 32
      }
    },
    {
      // 下级报表
      path: '/user/agent/lower-report',
      component: pages.AgentLowerReport,
      meta: {
        tab: false,
        index: 33
      }
    },
    {
      // 下级报表
      path: '/user/agent/lower-report/info/:uid',
      component: pages.AgentLowerReportInfo,
      props: true,
      meta: {
        tab: false,
        index: 34
      }
    },
    {
      // 下级人数
      path: '/user/agent/lower-count',
      component: pages.AgentLowerCount,
      meta: {
        tab: false,
        index: 35
      }
    },
    {
      // 赔率计算
      path: '/user/agent/odds',
      component: pages.AgentOdds,
      meta: {
        tab: false,
        index: 36
      }
    },
    {
      path: '/user/change-money',
      component: pages.ChangeMoney,
      meta: {
        tab: false,
        index: 37
      }
    },
    {
      path: '/user/account',
      component: pages.Account,
      meta: {
        tab: false,
        index: 38
      }
    },
    {
      path: '/user/record',
      component: pages.Bet,
      meta: {
        tab: false,
        index: 39
      }
    },
    {
      path: '/user/recordOneDay',
      name: 'UserRecord',
      component: pages.BetOneDay,
      meta: {
        tab: false,
        index: 40
      }
    },
    {
      path: '/user/betInfo',
      name: 'UserRecord',
      component: pages.BetInfo,
      meta: {
        tab: false,
        index: 41
      }
    },
    {
      path: '/user/record/list/:type/:date',
      component: pages.BetList,
      props: true,
      meta: {
        tab: false,
        index: 40
      }
    },
    {
      path: '/user/result',
      component: pages.Result,
      meta: {
        tab: false,
        index: 41
      }
    },
    {
      path: '/activity',
      component: pages.Activity,
      name: 'activity',
      meta: {
        tab: false,
        index: 42,
        keepAlive: true
      }
    },
    {
      path: '/activity/content',
      component: pages.Content,
      name: 'ActivityContent',
      meta: {
        tab: false,
        index: 43
      }
    },
    {
      path: '/download',
      component: pages.Download,
      meta: {
        tab: false,
        index: 44
      }
    },
    {
      path: '/download/theme/h5/installation',
      component: pages.Installation,
      meta: {
        tab: false,
        index: 45
      }
    },
    {
      path: '/download/theme/h5/website-information',
      component: pages.WebsiteInformation,
      meta: {
        tab: false,
        index: 46
      }
    },
    {
      path: '/save/qr-code',
      component: pages.QRCode,
      meta: {
        tab: false,
        index: 47
      }
    },
    {
      path: '/lottery/:series/:id',
      name: 'lottery',
      props: true,
      component: pages.Lottery,
      meta: {
        tab: false,
        index: 48
      }
    },
    {
      path: '/lottery/rules',
      name: 'lotteryRules',
      component: pages.LotteryRules,
      meta: {
        tab: false,
        index: 49
      }
    },
    {
      // 代理教程首页
      path: '/agent-doc',
      component: pages.AgentDoc,
      meta: {
        tab: false,
        index: 49
      }
    },
    {
      // 代理教程列表页
      path: '/agent-doc-list',
      component: pages.AgentDocList,
      meta: {
        tab: false,
        index: 50
      }
    },
    {
      // 代理教程详情页
      path: '/agent-doc-info',
      component: pages.AgentDocInfo,
      meta: {
        tab: false,
        index: 51
      }
    },
    {
      // 开奖走势
      path: '/trend/:id/:index',
      props: true,
      component: pages.Trend,
      meta: {
        tab: false,
        index: 52
      }
    },
    {
      // 开奖走势
      path: '/trend/:id',
      props: true,
      component: pages.Trend,
      meta: {
        tab: false,
        index: 53
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new',
      component: pages.AgencyCenterNew,
      meta: {
        tab: false,
        index: 54
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/take',
      component: pages.AgencyTake,
      meta: {
        tab: false,
        index: 55
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/commission-detail',
      component: pages.AgencyCommissionDetail,
      meta: {
        tab: false,
        index: 56
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/take/success',
      component: pages.AgencyTakeSuccess,
      meta: {
        tab: false,
        index: 57
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/report',
      component: pages.AgencyReport,
      meta: {
        tab: false,
        index: 58
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/report/:ti',
      props: true,
      component: pages.AgencyReport,
      meta: {
        tab: false,
        index: 59
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/report/:ti/:di',
      props: true,
      component: pages.AgencyReport,
      meta: {
        tab: false,
        index: 60
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/team',
      component: pages.AgencyTeam,
      meta: {
        tab: false,
        index: 61
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/team/:uid',
      props: true,
      component: pages.AgencyTeam,
      meta: {
        tab: false,
        index: 62
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open',
      component: pages.AgencyOpen,
      meta: {
        tab: false,
        index: 63
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open/edit/:code',
      props: true,
      component: pages.AgencyOpenEdit,
      meta: {
        tab: false,
        index: 64
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open/link',
      component: pages.AgencyOpenLink,
      meta: {
        tab: false,
        index: 65
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open/link/:status',
      props: true,
      component: pages.AgencyOpenLink,
      meta: {
        tab: false,
        index: 66
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open/look',
      component: pages.AgencyOpenLook,
      meta: {
        tab: false,
        index: 67
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/open/look/:index',
      props: true,
      component: pages.AgencyOpenLookItem,
      meta: {
        tab: false,
        index: 68
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/agency-report',
      component: pages.AgencyAgentReport,
      meta: {
        tab: false,
        index: 69
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/recode',
      component: pages.AgencyRecode,
      meta: {
        tab: false,
        index: 70
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/recode/user/:user',
      props: true,
      component: pages.AgencyRecode,
      meta: {
        tab: false,
        index: 71
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/recode/info/:type',
      props: true,
      component: pages.AgencyRecodeInfo,
      meta: {
        tab: false,
        index: 72
      }
    },
    {
      // 新代理中心
      path: '/user/agency-center-new/recode/:from/:type',
      props: true,
      component: pages.AgencyRecodeInfo,
      meta: {
        tab: false,
        index: 73
      }
    },
    {
      path: '/user/agency-center-new/team/lower-report/:uid/:username/:isAgent',
      props: true,
      component: pages.AgencyTeamLowerReport,
      meta: {
        tab: false,
        index: 74
      }
    },
    {
      path: '/user/agency-center-new/team/lower-edit/:uid/:username/:isAgent',
      props: true,
      component: pages.AgencyTeamLowerEdit,
      meta: {
        tab: false,
        index: 75
      }
    },
    {
      path: '/user/agency-center-new/dividend/:money',
      props: true,
      component: pages.AgencyDividend,
      meta: {
        tab: false,
        index: 76
      }
    },
    // 代理中心模式C
    {
      path: '/user/agency-center-modec',
      component: pages.AgencyCenterModec,
      meta: {
        tab: false,
        index: 77
      }
    },
    {
      path: '/user/agency-center-modec/open',
      component: pages.AgencyCenterModecOpen,
      meta: {
        tab: false,
        index: 78
      }
    },
    {
      path: '/user/agency-center-modec/desc',
      component: pages.AgencyCenterModecDesc,
      meta: {
        tab: false,
        index: 79
      }
    },
    {
      path: '/user/agency-center-modec/xm-inquire',
      component: pages.AgencyCenterModecxmInquire,
      meta: {
        tab: false,
        index: 80
      }
    },
    {
      path: '/user/agency-center-modec/xm-desc',
      component: pages.AgencyCenterModecxmDesc,
      meta: {
        tab: false,
        index: 81
      }
    },
    {
      path: '/user/agency-center-modec/team',
      component: pages.AgencyCenterModecTeam,
      meta: {
        tab: false,
        index: 82
      }
    },
    {
      path: '/user/agency-center-modec/performance',
      component: pages.AgencyCenterModecPerfo,
      meta: {
        tab: false,
        index: 83
      }
    },
    {
      path: '/user/agency-center-modec/performanceDesc/:game/:type',
      component: pages.AgencyCenterModecPerfoDesc,
      meta: {
        tab: false,
        index: 84
      }
    },
    {
      path: '/user/agency-center-modec/performance/proportion',
      component: pages.AgencyCenterModecPerfoProportion,
      meta: {
        tab: false,
        index: 85
      }
    },
    {
      path: '/user/agency-center-modec/receiv',
      component: pages.AgencyCenterModecReceiv,
      meta: {
        tab: false,
        index: 86
      }
    },
    {
      path: '/user/invite/:type',
      props: true,
      component: pages.Invite,
      meta: {
        tab: false,
        index: 87
      }
    },
    {
      path: '/user/invite-rule',
      props: true,
      component: pages.InviteRule,
      meta: {
        tab: false,
        index: 88
      }
    },
    {
      path: '/user/invite-reward',
      props: true,
      component: pages.InviteReward,
      meta: {
        tab: false,
        index: 89
      }
    },
    {
      path: '/user/invite-share/:id',
      props: true,
      component: pages.InviteShare,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/user/invite/member/share-reward',
      props: true,
      component: pages.InviteShareReward,
      meta: {
        tab: false,
        index: 111
      }
    },
    {
      path: '/user/invite/member/my-record',
      props: true,
      component: pages.InviteMyRecord,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/user/no-invite/member',
      props: true,
      component: pages.NoInviteMember,
      meta: {
        tab: false,
        index: 87
      }
    },
    {
      path: '/user/no-invite/member/my-record',
      props: true,
      component: pages.NoInviteMyRecord,
      meta: {
        tab: false,
        index: 88
      }
    },
    {
      path: '/user/no-invite/member/share',
      props: true,
      component: pages.NoInviteShare,
      meta: {
        tab: false,
        index: 88
      }
    },
    {
      path: '/user/no-invite/member/award',
      props: true,
      component: pages.NoInviteAward,
      meta: {
        tab: false,
        index: 88
      }
    },
    {
      // 新代理中心-投注记录
      path: '/user/agency-center-new/bet',
      component: pages.AgentBet,
      meta: {
        tab: false,
        index: 92
      }
    },
    {
      // 新代理中心-每日投注记录
      path: '/user/agency-center-new/bet-day',
      component: pages.AgentBetDay,
      meta: {
        tab: false,
        index: 93
      }
    },
    {
      path: '/user/invite/member/share-reward',
      props: true,
      component: pages.InviteShareReward,
      meta: {
        tab: false,
        index: 94
      }
    },
    {
      path: '/user/invite/member/my-record',
      props: true,
      component: pages.InviteMyRecord,
      meta: {
        tab: false,
        index: 95
      }
    },
    {
      path: '/user/invite/member/member-list',
      props: true,
      component: pages.InviteMemberList,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/user/YuEBaoCenter',
      props: true,
      component: pages.YuEBaoCenter,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/user/YuEBaoExplain',
      props: true,
      component: pages.YuEBaoExplain,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/user/YuEBaoRoll/:type',
      props: true,
      component: pages.YuEBaoRoll,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/user/YuEBaoDetail',
      props: true,
      component: pages.YuEBaoDetail,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/home-login-a',
      props: true,
      component: pages.HomeLoginA,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/home-login-b',
      props: true,
      component: pages.HomeLoginB,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/home-login-c',
      props: true,
      component: pages.HomeLoginC,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/user/JieBeiCenter',
      props: true,
      component: pages.JieBeiCenter,
      meta: {
        tab: false,
        index: 90
      }
    },
    {
      path: '/user/JieBeiMy',
      props: true,
      component: pages.JieBeiMy,
      meta: {
        tab: false,
        index: 91
      }
    },
    {
      path: '/user/JieBeiApply/:type',
      props: true,
      component: pages.JieBeiApply,
      meta: {
        tab: false,
        index: 92
      }
    },
    {
      path: '/user/JieBeiRecord',
      props: true,
      component: pages.JieBeiRecord,
      meta: {
        tab: false,
        index: 93
      }
    },
    {
      path: '/user/JieBeiDetails',
      props: true,
      component: pages.JieBeiDetails,
      meta: {
        tab: false,
        index: 94
      }
    },
    {
      path: '/user/JieBeiLimit',
      props: true,
      component: pages.JieBeiLimit,
      meta: {
        tab: false,
        index: 95
      }
    },
    {
      path: '/user/JieBeiResult',
      props: true,
      component: pages.JieBeiResult,
      meta: {
        tab: false,
        index: 96
      }
    },
    {
      path: '/help',
      component: pages.Help,
      name: 'help',
      meta: {
        tab: false,
        index: 97
      }
    },
    {
      path: '/beforeLogin',
      component: pages.BeforeLogin,
      name: 'beforeLogin',
      meta: {
        tab: false,
        index: 97
      }
    },
    {
      path: '/hotgame-more',
      component: pages.hotGameMore,
      name: 'hotGameMore',
      meta: {
        tab: false,
        index: 97
      }
    },
    {
      path: '/android-page',
      component: pages.AndroidPage,
      name: 'android',
      meta: {
        tab: false,
        index: 97
      }
    },
  ]
})
