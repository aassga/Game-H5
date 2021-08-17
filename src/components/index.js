import InputRow from './input-row/InputRow'
import TitleHeader from './title-header/TitleHeader'
import PubDialog from './pub-dialog/PubDialog'
import IosAlert from './ios-alert/IosAlert'
import KaiJiang from './kai-jiang/index'
import HongBaoYu from './hong-bao-yu/index'
import HongBaoKai from './hong-bao-kai/index'
import RedPacketClose from './red-packet-close'
import RedLope from './red-lope/index'
import IosPopupSelect from './ios-popup-select/IosPopupSelect'
import DateInterval from './date-interval/DateInterval'
import ScrollBox from './scroll-box/ScrollBox'
import ListView from './list-view/ListView'
import distanceLogin from './distance-login'
import dragBox from './drag-box'

export default {
  install (Vue) {
    Vue.component('input-row', InputRow)
    Vue.component('title-header', TitleHeader)
    Vue.component('pub-dialog', PubDialog)
    Vue.component('ios-alert', IosAlert)
    Vue.component('kai-jiang', KaiJiang)
    Vue.component('hong-bao-yu', HongBaoYu)
    Vue.component('hong-bao-kai', HongBaoKai)
    Vue.component('red-packet-close',RedPacketClose)
    Vue.component('red-lope', RedLope)
    Vue.component('ios-popup-select', IosPopupSelect)
    Vue.component('date-interval', DateInterval)
    Vue.component('scroll-box', ScrollBox)
    Vue.component('list-view', ListView)
    Vue.component('distance-login', distanceLogin)
    Vue.component('drag-box', dragBox)
  }
}
