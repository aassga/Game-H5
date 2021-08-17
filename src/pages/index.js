const ViewPage = () => import(/* webpackChunkName: "view-page" */ './ViewPage').then(m => m.default)
const Home = () => import(/* webpackChunkName: "home" */ './home/Home').then(m => m.default)
const Login = () => import(/* webpackChunkName: "Login" */ './admin/Login').then(m => m.default)
const Register = () => import(/* webpackChunkName: "Register" */ './admin/Register').then(m => m.default)
const Type = () => import(/* webpackChunkName: "game" */ './type/Type').then(m => m.default)
const GameList = () => import(/* webpackChunkName: "game" */ './game/GameList').then(m => m.default)
const User = () => import(/* webpackChunkName: "member" */ './user/User').then(m => m.default)
const Save = () => import(/* webpackChunkName: "member" */ './save/Save').then(m => m.default)
const SaveSubmit = () => import(/* webpackChunkName: "member" */ './save/SaveSubmit').then(m => m.default)
const SaveDeposit = () => import(/* webpackChunkName: "member" */ './save/SaveDeposit').then(m => m.default)
const sutomerSaveList = () => import(/* webpackChunkName: "member" */ './save/sutomerSaveList').then(m => m.default)
const QRCode = () => import(/* webpackChunkName: "member" */ './save/QRCode').then(m => m.default)
const About = () => import(/* webpackChunkName: "member" */ './about/About').then(m => m.default)
const Help = () => import(/* webpackChunkName: "Help" */ './help/Help').then(m => m.default)
const Message = () => import(/* webpackChunkName: "member" */ './user/message/Message').then(m => m.default)
const Report = () => import(/* webpackChunkName: "member" */ './user/report/Report').then(m => m.default)
const Take = () => import(/* webpackChunkName: "member" */ './take/Take').then(m => m.default)
const UserInfo = () => import(/* webpackChunkName: "member" */ './user/info/UserInfo').then(m => m.default)
const AddBank = () => import(/* webpackChunkName: "member" */ './user/info/children/AddBank').then(m => m.default)
const AddUsdt = () => import(/* webpackChunkName: "member" */ './user/info/children/AddUsdt').then(m => m.default)
const BaseEditor = () => import(/* webpackChunkName: "member" */ './user/info/children/BaseEditor').then(m => m.default)
const CardEditor = () => import(/* webpackChunkName: "member" */ './user/info/children/CardEditor').then(m => m.default)
const Account = () => import(/* webpackChunkName: "member" */ './user/account/Account2').then(m => m.default)
const Result = () => import(/* webpackChunkName: "member" */ './user/result/Result').then(m => m.default)
const AgencyCenter = () => import(/* webpackChunkName: "agent" */ './user/agency-center/AgencyCenter').then(m => m.default)
const AgentIncome = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentIncome').then(m => m.default)
const AgentIncomeInfo = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/info/AgentIncomeInfo').then(m => m.default)
const AgentOddsEditor = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/info/AgentOddsEditor').then(m => m.default)
const AgentReport = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentReport').then(m => m.default)
const AgentOpen = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentOpen').then(m => m.default)
const AgentOpenOdds = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/info/AgentOpenOdds').then(m => m.default)
const AgentList = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentList').then(m => m.default)
const AgentFinance = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentFinance').then(m => m.default)
const AgentLowerReport = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentLowerReport').then(m => m.default)
const AgentLowerReportInfo = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/info/AgentLowerReportInfo').then(m => m.default)
const AgentLowerCount = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentLowerCount').then(m => m.default)
const AgentOdds = () => import(/* webpackChunkName: "agent" */ './user/agency-center/children/AgentOdds').then(m => m.default)
const MoneyRule = () => import(/* webpackChunkName: "agent" */ './user/agency-center/change-money/MoneyRule').then(m => m.default)
const MoneyRuleApp = () => import(/* webpackChunkName: "agent" */ './user/agency-center/change-money/MoneyRuleApp.vue').then(m => m.default)
const ChangeMoney = () => import(/* webpackChunkName: "agent" */ './user/agency-center/change-money/ChangeMoney').then(m => m.default)
const Bet = () => import(/* webpackChunkName: "bet" */ './user/bet/Bet2').then(m => m.default)
const BetOneDay = () => import(/* webpackChunkName: "bet" */ './user/bet/Bet3OneDay').then(m => m.default)
const BetInfo = () => import(/* webpackChunkName: "bet" */ './user/bet/BetInfo').then(m => m.default)
const BetLottery = () => import(/* webpackChunkName: "bet" */ './user/bet/BetLottery').then(m => m.default)
const BetLive = () => import(/* webpackChunkName: "bet" */ './user/bet/BetLive').then(m => m.default)
const BetSlot = () => import(/* webpackChunkName: "bet" */ './user/bet/BetSlot').then(m => m.default)
const BetChess = () => import(/* webpackChunkName: "bet" */ './user/bet/BetChess').then(m => m.default)
const BetSport = () => import(/* webpackChunkName: "bet" */ './user/bet/BetSport').then(m => m.default)
const BetList = () => import(/* webpackChunkName: "bet" */ './user/bet/BetList').then(m => m.default)
const Activity = () => import(/* webpackChunkName: "activity" */ './activity/Activity').then(m => m.default)
const Content = () => import(/* webpackChunkName: "activity" */ './activity/Content').then(m => m.default)
const Download = () => import(/* webpackChunkName: "download" */ './download/Download').then(m => m.default)
const Installation = () => import(/* webpackChunkName: "download" */ './download/theme/h5/installation').then(m => m.default)
const WebsiteInformation = () => import(/* webpackChunkName: "download" */ './download/theme/h5/websiteInformation').then(m => m.default)
const Lottery = () => import(/* webpackChunkName: "lottery" */ './lottery/Lottery').then(m => m.default)
const LotteryRules = () => import(/* webpackChunkName: "lottery" */ './lottery/rules/rules').then(m => m.default)
const LotteryCp11x5 = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-cp11x5/LotteryCp11x5').then(m => m.default)
const LotteryK3 = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-k3/LotteryK3').then(m => m.default)
const LotteryKlsf = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-klsf/LotteryKlsf').then(m => m.default)
const LotteryLhc = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-lhc/LotteryLhc').then(m => m.default)
const LotteryPcdd = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-pcdd/LotteryPcdd').then(m => m.default)
const LotteryPk10 = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-pk10/LotteryPk10').then(m => m.default)
const LotterySsc = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-ssc/LotterySsc').then(m => m.default)
const LotteryDpc = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-dpc/LotteryDpc').then(m => m.default)
const LotteryClzs = () => import(/* webpackChunkName: "lottery" */ './lottery/kind/lottery-clzs/LotteryClzs').then(m => m.default)
const AgentDoc = () => import(/* webpackChunkName: "agent-doc" */ './agent-doc').then(m => m.default)
const AgentDocList = () => import(/* webpackChunkName: "agent-doc" */ './agent-doc/AgentDocList').then(m => m.default)
const AgentDocInfo = () => import(/* webpackChunkName: "agent-doc" */ './agent-doc/AgentDocInfo').then(m => m.default)
const Trend = () => import(/* webpackChunkName: "trend" */ './lottery/trend/Trend').then(m => m.default)
const AgencyCenterNew = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/Index').then(m => m.default)
const AgencyTake = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/take/Take').then(m => m.default)
const AgencyCommissionDetail = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/take/CommissionDetail').then(m => m.default)
const AgencyTakeSuccess = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/take/Success').then(m => m.default)
const AgencyReport = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/report/Report').then(m => m.default)
const AgencyTeam = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/team/Team').then(m => m.default)
const AgencyTeamLowerReport = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/team/LowerReport').then(m => m.default)
const AgencyTeamLowerEdit = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/team/EditRebate').then(m => m.default)
const AgencyAgentReport = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/team/AgentReport').then(m => m.default)
const AgencyOpen = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/open/Open').then(m => m.default)
const AgencyOpenEdit = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/open/Edit').then(m => m.default)
const AgencyOpenLink = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/open/Link').then(m => m.default)
const AgencyOpenLook = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/open/Look').then(m => m.default)
const AgencyOpenLookItem = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/open/LookItem').then(m => m.default)
const AgencyRecode = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/recode/Recode').then(m => m.default)
const AgencyRecodeInfo = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/recode/RecodeInfo').then(m => m.default)
const AgencyDividend = () => import(/* webpackChunkName: "agent-center-new" */ './agent-center-new/AgencyDividend').then(m => m.default)
const AgencyCenterModec = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c').then(m => m.default)
const AgencyCenterModecOpen = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/open').then(m => m.default)
const AgencyCenterModecDesc = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/agent-desc').then(m => m.default)
const AgencyCenterModecxmInquire = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/xima/inquire').then(m => m.default)
const AgencyCenterModecxmDesc = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/xima/desc').then(m => m.default)
const AgencyCenterModecPerfo = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/Performance').then(m => m.default)
const AgencyCenterModecPerfoDesc = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/Performance/perfomanceDesc.vue').then(m => m.default)
const AgencyCenterModecPerfoProportion = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/Performance/proportion.vue').then(m => m.default)
const AgencyCenterModecTeam = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/team').then(m => m.default)
const AgencyCenterModecReceiv = () => import(/* webpackChunkName: "agent-center-modec" */ './agent-mode-c/receiv').then(m => m.default)
const Invite = () => import(/* webpackChunkName: "invite" */ './user/invite').then(m => m.default)
const InviteRule = () => import(/* webpackChunkName: "invite" */ './user/invite/inviteRule').then(m => m.default)
const InviteReward = () => import(/* webpackChunkName: "invite" */ './user/invite/inviteReward').then(m => m.default)
const InviteShare = () => import(/* webpackChunkName: "invite" */ './user/invite/inviteShare').then(m => m.default)
const InviteShareReward = () => import(/* webpackChunkName: "invite" */ './user/invite/member/shareReward').then(m => m.default)
const InviteMyRecord = () => import(/* webpackChunkName: "invite" */ './user/invite/member/myRecord.vue').then(m => m.default)
const InviteMemberList = () => import(/* webpackChunkName: "invite" */ './user/invite/member/memberList').then(m => m.default)
const NoInviteMember = () => import(/* webpackChunkName: "invite" */ './user/invite/no-member').then(m => m.default)
const NoInviteMyRecord = () => import(/* webpackChunkName: "invite" */ './user/invite/no-member/myRecord.vue').then(m => m.default)
const NoInviteShare = () => import(/* webpackChunkName: "invite" */ './user/invite/no-member/share.vue').then(m => m.default)
const NoInviteAward = () => import(/* webpackChunkName: "invite" */ './user/invite/no-member/award.vue').then(m => m.default)
// const Code = () => import(/* webpackChunkName: "page-code" */ './code/Code').then(m => m.default)
const AgentBet = () => import(/* webpackChunkName: "invite" */ './agent-center-new/bet').then(m => m.default)
const AgentBetDay = () => import(/* webpackChunkName: "invite" */ './agent-center-new/bet/day').then(m => m.default)
const YuEBaoCenter = () => import(/* webpackChunkName: "YuEBao" */ './user/YuEBao/YuEBaoCenter.vue').then(m => m.default)
const YuEBaoExplain = () => import(/* webpackChunkName: "YuEBao" */ './user/YuEBao/YuEBaoExplain.vue').then(m => m.default)
const YuEBaoRoll = () => import(/* webpackChunkName: "YuEBao" */ './user/YuEBao/YuEBaoRoll.vue').then(m => m.default)
const YuEBaoDetail = () => import(/* webpackChunkName: "YuEBao" */ './user/YuEBao/YuEBaoDetail.vue').then(m => m.default)
const HomeLoginA = () => import(/* webpackChunkName: "HomeLogin" */ './home-login/A-login.vue').then(m => m.default)
const HomeLoginB = () => import(/* webpackChunkName: "HomeLogin" */ './home-login/B-login.vue').then(m => m.default)
const HomeLoginC = () => import(/* webpackChunkName: "HomeLogin" */ './home-login/C-login.vue').then(m => m.default)
const JieBeiCenter = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiCenter.vue').then(m => m.default)
const JieBeiMy = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiMy.vue').then(m => m.default)
const JieBeiApply = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiApply.vue').then(m => m.default)
const JieBeiRecord = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiRecord.vue').then(m => m.default)
const JieBeiDetails = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiDetails.vue').then(m => m.default)
const JieBeiLimit = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiLimit.vue').then(m => m.default)
const JieBeiResult = () => import(/* webpackChunkName: "JieBei" */ './user/JieBei/JieBeiResult.vue').then(m => m.default)
const BeforeLogin = () => import(/* webpackChunkName: "BeforeLogin" */ './beforeLogin/index.vue').then(m => m.default)
const hotGameMore = () => import(/* webpackChunkName: "hotGameMore" */ './home/theme/blush/hotGame-more.vue').then(m => m.default)
const AndroidPage = () => import(/* webpackChunkName: "AndroidPage" */ './androidPage/amhg.vue').then(m => m.default)
/**
 * for *-login router
 */
 const loginDefault = () => import(/* webpackChunkName: "loginDefault" */ './admin/Login').then(m => m.default)
const amhgLogin = () => import(/* webpackChunkName: "amhgLogin" */ './admin/amhgLogin').then(m => m.default)
const aqvnsLogin = () => import(/* webpackChunkName: "aqvnsLogin" */ './admin/aqvnsLogin').then(m => m.default)
const betnewLocgin = () => import(/* webpackChunkName: "betnewLocgin" */ './admin/betnewLogin').then(m => m.default)
const BlrLogin = () => import(/* webpackChunkName: "blrLogin" */ './admin/BlrLogin').then(m => m.default)
const BlushLogin = () => import(/* webpackChunkName: "blushLogin" */ './admin/Blush').then(m => m.default)
const cpxpjLogin = () => import(/* webpackChunkName: "cpxpjLogin" */ './admin/cpxpjLogin').then(m => m.default)
const etnqpLogin = () => import(/* webpackChunkName: "etnqpLogin" */ './admin/etnqpLogin').then(m => m.default)
const fhcpLogin = () => import(/* webpackChunkName: "fhcpLogin" */ './admin/fhcpLogin').then(m => m.default)
const kyqpLogin = () => import(/* webpackChunkName: "kyqpLogin" */ './admin/kyqpLogin').then(m => m.default)
const newqpLogin = () => import(/* webpackChunkName: "newqpLogin" */ './admin/newqpLogin').then(m => m.default)
const tccpLogin = () => import(/* webpackChunkName: "tccpLogin" */ './admin/tccpLogin').then(m => m.default)
const VnsLogin = () => import(/* webpackChunkName: "VnsLogin" */ './admin/VnsLogin').then(m => m.default)
const vnsoLogin = () => import(/* webpackChunkName: "vnsoLogin" */ './admin/vnsoLogin').then(m => m.default)
const VnstLogin = () => import(/* webpackChunkName: "vnstLogin" */ './admin/VnstLogin').then(m => m.default)
const VnstLogin2 = () => import(/* webpackChunkName: "vnstLogin2" */ './admin/VnstLogin2').then(m => m.default)
const CLogin = () => import(/* webpackChunkName: "cLogin" */ './home-login/C-login').then(m => m.default)
export {
  loginDefault,
  CLogin,
  amhgLogin,
  aqvnsLogin,
  betnewLocgin,
  BlrLogin,
  BlushLogin,
  cpxpjLogin,
  etnqpLogin,
  fhcpLogin,
  kyqpLogin,
  newqpLogin,
  tccpLogin,
  vnsoLogin,
  VnstLogin,
  VnstLogin2,
  ViewPage,
  Home,
  Login,
  Register,
  VnsLogin,
  Type,
  GameList,
  User,
  Save,
  SaveSubmit,
  SaveDeposit,
  sutomerSaveList,
  QRCode,
  About,
  Help,
  Message,
  Report,
  Take,
  UserInfo,
  BaseEditor,
  CardEditor,
  AddBank,
  AddUsdt,
  AgencyCenter,
  AgentIncome,
  AgentReport,
  AgentOpen,
  AgentList,
  AgentFinance,
  AgentLowerReport,
  AgentLowerCount,
  AgentOdds,
  AgentIncomeInfo,
  AgentOddsEditor,
  AgentLowerReportInfo,
  AgentOpenOdds,
  MoneyRule,
  ChangeMoney,
  Account,
  Bet,
  BetOneDay,
  BetInfo,
  BetLottery,
  BetLive,
  BetSlot,
  BetChess,
  BetSport,
  BetList,
  Result,
  Activity,
  Content,
  Download,
  Installation,
  MoneyRuleApp,
  WebsiteInformation,
  Lottery,
  LotteryRules,
  LotteryCp11x5,
  LotteryK3,
  LotteryKlsf,
  LotteryLhc,
  LotteryPcdd,
  LotteryPk10,
  LotterySsc,
  LotteryDpc,
  LotteryClzs,
  AgentDoc,
  AgentDocList,
  AgentDocInfo,
  Trend,
  AgencyCenterNew,
  AgencyTake,
  AgencyCommissionDetail,
  AgencyTakeSuccess,
  AgencyReport,
  AgencyTeam,
  AgencyTeamLowerEdit,
  AgencyAgentReport,
  AgencyOpen,
  AgencyOpenEdit,
  AgencyOpenLink,
  AgencyOpenLook,
  AgencyOpenLookItem,
  AgencyRecode,
  AgencyTeamLowerReport,
  AgencyRecodeInfo,
  AgencyDividend,
  AgencyCenterModec,
  AgencyCenterModecOpen,
  AgencyCenterModecDesc,
  AgencyCenterModecxmInquire,
  AgencyCenterModecxmDesc,
  AgencyCenterModecPerfo,
  AgencyCenterModecPerfoDesc,
  AgencyCenterModecPerfoProportion,
  AgencyCenterModecTeam,
  AgencyCenterModecReceiv,
  Invite,
  InviteRule,
  InviteReward,
  InviteShare,
  InviteShareReward,
  InviteMyRecord,
  InviteMemberList,
  NoInviteMember,
  NoInviteMyRecord,
  NoInviteShare,
  NoInviteAward,
  AgentBet,
  AgentBetDay,
  // Code,
  YuEBaoCenter,
  YuEBaoExplain,
  YuEBaoRoll,
  YuEBaoDetail,
  HomeLoginA,
  HomeLoginB,
  HomeLoginC,
  JieBeiCenter,
  JieBeiMy,
  JieBeiApply,
  JieBeiRecord,
  JieBeiDetails,
  JieBeiLimit,
  JieBeiResult,
  BeforeLogin,
  hotGameMore,
  AndroidPage
}
