<template>
  <view-page ref="view-page" full-box class="agent-open theme-header-bg" @scroll-height-change="height => {this.contentHeight = height}"  >
    <title-header title="推广开户"  slot="header" class="theme-main-bg theme-header-bottom"></title-header>

    <div slot="header-static" :class="['theme-header-bg',{'black-tab' : $config.blackTheme || $config.newQP,'blush-tab' : $config.blush}]" style="padding: 0.2rem 0 0 0;">
      <van-tabs
        v-model="tabIndex"
        :line-height="2"
        line-width="1.4rem"
      >
        <van-tab
          v-if="personalMode!=='mode_b'"
          :title="(siteModel === 'invite_link' ? '推广链接' : '邀请码')"
        ></van-tab>
        <van-tab v-else title="分享朋友"></van-tab>
        <van-tab title="精准开户"></van-tab>
      </van-tabs>
    </div>

    <div slot="content" ref="swipe">
        <transition-group :name="animation" >
           <div v-show="tabIndex == 0"  key="list1" class="lotter-link">
              <div v-if="personalMode!=='mode_b'" class="link">
                <list-view
                  ref="list"
                  :style="{height: (contentHeight-0.96*rem)+'px'}"
                  @load-top="onRefresh"
                  :noMore="noMore"
                  @load-down="onLoadMore"
                >
              <ul style="padding: 0.24rem 0" v-if="list.length">
                <li class="view-box link-item theme-main-bg-5" v-for="(item, i) in list" :key="i"  data-type="0">
                  <div class="link-left" @touchstart.capture="touchStart" @touchend.capture="touchEnd" >
                      <div class="link-info theme-after-border-color">
                          <p class="link-content-row theme-color-gray-9">{{siteModel&&siteModel==='invite_link'?item['domain']:item['agencyCode']}}</p>
                          <p class="link-info-row">
                            <span class="theme-color-white">
                              我的返水:
                              <i class="value">{{item['max_rate']}}%</i>
                            </span>
                            <span class="theme-color-white">
                              提成:
                              <i class="value">{{item['diff_rate']}}%</i>
                            </span>
                            <span class="theme-color-white">
                              注册:
                              <i class="value">{{item['register_count']}}人</i>
                            </span>
                          </p>
                        </div>
                        <ul class="link-action">
                          <li class="link-action-item theme-color theme-after-border-color theme-color-yellow" @click="onLook(item)">查看</li>
                          <li class="link-action-item theme-color theme-color-yellow" @click="onCopy(item)">复制</li>
                        </ul>
                        <span :class="'is-agent-' + item['is_agency']">{{item['is_agency']?'代理':'会员'}}</span>
                      </div>
                    <div class="link-right">
                        <p class="link-delete" @click="deleteLink(item,i)">删除</p>
                    </div>
                </li>
              </ul>
              <div v-else-if="loaded">
                <img style="width: 100%;margin-top: 1rem;" :src="noDataImg" alt />
                <p class="theme-color-white" style="font-size: 0.3rem;color: #666666">暂无数据</p>
              </div>
              <p v-if="totalCount > 5" style="font-size: 0.26rem; line-height: 0.84rem; color: #000;text-align: center;">
              已显示最近{{totalCount}}条记录
              </p>
            </list-view>
            <button
              v-if="personalMode!=='mode_b'"
              class="btn-user-link theme-bg theme-gradient-bg-4 theme-color-yellow"
              style="width: calc( 100% - 0.7px);border-radius: 0"
              @click="$router.push('/user/agency-center-new/open/link')"
            >生成{{siteModel === 'invite_link' ? '邀请链接' : '邀请码'}}</button>
            </div>
            <div class="shore" style="padding-top: 0.24rem" v-else>
              <div v-if="agencyType==='shareholder'" class="shore-shareholder" ref="pic">
                <div class="view-box theme-main-bg-5">
                  <img style="width: 100%" :src="fontImg[7]" alt />
                  <ul class="info-row">
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[4]" alt />
                      <span class="info-1 theme-color-white">0投入</span>
                    </li>
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[5]" alt />
                      <span class="info-1 theme-color-white">0风险</span>
                    </li>
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[6]" alt />
                      <span class="info-1 theme-color-white">高回报</span>
                    </li>
                  </ul>

                  <div class="qr-code" ref="qr-code"></div>

                  <p
                    class="code-info"
                    v-if="siteModel!=='invite_link' && list[0]"
                  >邀请码: {{list[0]['agencyCode']}}</p>
                </div>
              </div>
              <div v-else class="shore-agent" ref="pic">
                <div class="view-box theme-main-bg-5">
                  <img style="width: 100%" :src="fontImg[3]" alt />
                  <ul class="info-row">
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[0]" alt />
                      <p class="info-1 theme-color-white">平台安全运维</p>
                      <p class="info-2">
                        <span class="num theme-color theme-color-yellow">4</span>
                        <span class="theme-color-white">周年</span>
                      </p>
                    </li>
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[1]" alt />
                      <p class="info-1 theme-color-white">累计注册</p>
                      <p class="info-2">
                        <span class="num theme-color theme-color-yellow">1000</span>
                        <span class="theme-color-white">万人</span>
                      </p>
                    </li>
                    <li class="info-row-item">
                      <img class="icon" :src="fontImg[2]" alt />
                      <p class="info-1 theme-color-white">日均交易量</p>
                      <p class="info-2">
                        <span class="num theme-color theme-color-yellow">2</span>
                        <span class="theme-color-white">亿元</span>
                      </p>
                    </li>
                  </ul>

                  <div class="qr-code" ref="qr-code"></div>

                  <p
                    class="code-info"
                    v-if="siteModel!=='invite_link' && list[0]"
                  >邀请码: {{list[0]['agencyCode']}}</p>
                </div>
              </div>

              <div class="active-box">
                <!--<button class="btn-save theme-color theme-border-1px" @click="onSave">保存图片</button>-->
                <button class="btn-save theme-color theme-border-1px theme-main-bg-5 theme-color-yellow theme-border-yellow">截屏保存图片</button>
                <button
                  class="btn-copy theme-bg theme-border theme-yellow-bg-2 theme-color-black"
                  @click="onCopy(list[0])"
                >复制{{siteModel==='invite_link'?'链接':'邀请码'}}</button>
              </div>
            </div>
          </div>
          <div  v-show="tabIndex == 1"  key="list2" class="lotter-user user" >
          <scroll-box :class="{'black-scroll':$config.blackTheme || $config.newQP|| $config.blush}" :style="{height: (contentHeight)+'px'}">
              <div style="padding-top: 0.24rem">
                <p class="info" v-show="personalMode==='mode_a'">
                  <span class="van-icon van-icon-warning-o"></span>
                  <span>下级抽成最小为0，不获得返佣。最大不超过0.3%</span>
                </p>
                <van-cell-group
                  class="view-box theme-main-bg-5"
                  style="overflow: hidden;margin-top: 0;padding: 0.2rem 0 0.1rem 0;"
                  :border="false"
                >
                  <div class="no-link" v-show="!['mode_a','mode_b'].includes(personalMode)">
                    <span class="title theme-color-white">开户类型</span>
                    <span class="link-type theme-border-1px theme-color" :class="[{'active theme-yellow-bg-2 theme-color-black': userType===1 },{'theme-main-bg-5 theme-color-yellow theme-border-yellow': userType!==1 }]" @click="userType=1">代理</span>
                    <span class="link-type theme-border-1px theme-color" :class="[{'active theme-yellow-bg-2 theme-color-black': userType===0 },{'theme-main-bg-5 theme-color-yellow theme-border-yellow' : userType!==0}]" @click="userType=0">会员</span>
                  </div>
                  <van-field
                    v-model="inviteUserName"
                    type="text"
                    label="开户帐号"
                    placeholder="请输入6-10位字母或数字"
                    :error="false"
                    maxlength="10"
                    class="theme-main-bg-5 theme-after-border-nocolor"
                  >
                    <van-loading slot="right-icon" color="#2C93FF" v-show="userChecking"></van-loading>
                  </van-field>
                  <p class="theme-border-color" style="border:0.02rem solid #ebedf0;margin: 0 0.3rem;padding-left: 1rem;margin-left: 1.8rem; transform: scaleY(.4);"></p>

                  <van-field
                    v-model="$store.state.agency.password"
                    type="text"
                    label="初始密码"
                    placeholder="请输入6-10位字母或数字"
                    disabled
                    class="theme-main-bg-5 theme-after-border-nocolor"
                  />
                </van-cell-group>
              </div>

              <ul v-if="$store.state.agency.refundRebate" v-show="personalMode!=='mode_b'">
                <li
                  class="view-box rebate-item theme-main-bg-5"
                  v-for="(item, i) in $store.state.agency.refundRebate"
                  :key="i"
                  @click="$router.push('/user/agency-center-new/open/edit/' + i)"
                >
                  <div class="bmg theme-agent-rebate theme-yellow-bg-2">
                    <span class="label" :class="getLabelClass(item)">{{item['type_cn']}}</span>
                  </div>
                  <div class="rebate-box">
                    <p class="info-row">
                      <span class="theme-color-white">我的:</span>
                      <span class="value">{{getMax(item.list).val}}%</span>
                      <span class="span"></span>
                      <span class="theme-color-white">下级:</span>
                      <span class="value">
                        {{getFloatOne((getMax($store.state.agency.refundRebate[i].list).val*10 -
                        (getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue'] || 0)*10) / 10)}}%
                      </span>
                    </p>
                    <p class="edit-row">
                      <span class="edit-label theme-color-white">提成</span>

                      <span
                        class="edit-action iconfont h5-icon-icon-subtract border_l theme-color-yellow theme-border-color-3"
                        @click.stop="onSub(i)"
                        :class="{disabled:(getMax($store.state.agency.refundRebateForOpen[i].list)['subValue']||0)<=0}"
                      ></span>

                      <span
                        class="edit-value theme-color-white theme-border-color-3"
                        @click.stop="onSelect(i)"
                      >{{getFloatOne(getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue']) || '0.0'}}</span>

                      <span
                        class="edit-action iconfont h5-icon-icon-plus border_r theme-color-yellow theme-border-color-3"
                        @click.stop="onAdd(i)"
                        :class="{disabled:getMaxDiffItem($store.state.agency.refundRebateForOpen[i].list)['subValue']>=getMaxDiff(i)}"
                      ></span>
                    </p>
                  </div>
                  <span class="van-icon van-icon-arrow"></span>
                </li>
              </ul>
              <button class="btn-user theme-bg theme-yellow-bg-2 theme-color-black" style="margin-top: 0.4rem" @click="onSubmit">确认开户</button>
            <div style="height: 0.72rem"></div>
            </scroll-box>
            </div>
        </transition-group>
    </div>

    <div slot="static">
      <van-popup v-model="showSelector" position="bottom" get-container="body">
        <van-picker
          show-toolbar
          :item-height='40'
          v-model="showSelector"
          :columns="getValList().map(n => getFloatOne(n))"
          value-key="name"
          @confirm="onRebateSelect"
          @cancel="showSelector=false"
          :default-index="getValList().indexOf(editVal)"
          :class="{'black-van-picker':$config.blackTheme || $config.newQP,'blush-van-picker':$config.blush}"
        ></van-picker>
      </van-popup>
    </div>
  </view-page>
</template>

<script type="text/javascript">
import QRCode from "qrcodejs2";
import Html2Canvas from "html2canvas";

export default {
  name: "Open",
  data() {
    return {
      inviteUserName:'',
      contentHeight: 0,
      tabIndex: 0,
      submitting: false,
      userType: 1,
      userErr: false,
      totalCount:0,
      userChecking: false,
      loaded: false,
      showSelector: false,
      editMax: 0.3,
      dates: [],
      startX:0,
      editIndex: NaN,
      editVal: 0,
      endX : 0 ,
      page: 0,
      limit: 20,
      noMore: false,
      loading: false,
      list: [],
      animation:'slide-left',
      qr: null
    };
  },
  created() {
    if (this.$store.state.agency.editing) {
      this.$store.state.agency.editing = false;
      if (this.$store.state.agency.openTabIndex) {
        this.tabIndex = this.$store.state.agency.openTabIndex;
      }
    } else {
      this.$store.state.agency.openTabIndex = 0;
      this.$store.dispatch("agency/getRefundRebate").then(res => {});
    }
    setTimeout(()=>{
     window.document.body.scrollTo(0, 0)
    },500)
    const dates = [0];
    for (let i = 0; i <= this.editMax; i += 0.1) {
      dates.push(Math.round(i * 10 + 1) / 10);
    }
    this.dates = dates;
    if (this.tabIndex === 0){
      this.onRefresh()
    };
  },
  beforeRouteLeave(to,from,next){
    if(to.fullPath == '/user/agency-center-new'){
      delete localStorage.getInviteList
    }
    next()
  },
  destroyed() {
    this.$store.state.agency.openTabIndex = this.tabIndex;
  },
  watch: {
    "$store.state.agency.openTabIndex"() {
      // if (this.$store.state.agency.openTabIndex === 0) this.onRefresh()
    },
    tabIndex(val,old) {
      if (this.tabIndex === 0){
        this.onRefresh()
      };
      if (val < old) {
        this.animation = 'slide-right'
      } else {
        this.animation = 'slide-left'
      }
    }
  },
  computed: {
    fontImg() {
      if(this.$config.blackTheme || this.$config.newQP) {
        return [
          require("../../../assets/img/agent-center-new/open-link/open-icon-black-0.png"),
          require("../../../assets/img/agent-center-new/open-link/open-icon-black-1.png"),
          require("../../../assets/img/agent-center-new/open-link/open-icon-black-2.png"),
          require("../../../assets/img/agent-center-new/open-link/open-share-bluegreen.png"),
          require("../../../assets/img/agent-center-new/open-link/open-share-icon-black-1.png"),
          require("../../../assets/img/agent-center-new/open-link/open-share-icon-black-2.png"),
          require("../../../assets/img/agent-center-new/open-link/open-share-icon-black-3.png"),
          require("../../../assets/img/agent-center-new/open-link/open-share-holder-bluegreen.png")
          ];
      }else {
        switch (this.targetTheme.code) {
        case "default":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-defaul-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-defaul.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-defaul-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-defaul-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-defaul-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-defaul.png")
          ];
        case "red":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-red-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-red.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-red-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-red-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-red-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-red.png")
          ];
        case "deepred":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-deepred-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-deepred-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-deepred-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-deepred.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-deepred-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-deepred-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-deepred-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-deepred.png")
          ];
        case "yellow":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-yellow-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-yellow-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-yellow-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-yellow.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-yellow-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-yellow-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-yellow-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-yellow.png")
          ];
        case "purple":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-purple-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-purple.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-purple-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-purple-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-purple-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-purple.png")
          ];
        case "green":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-green-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-green.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-green-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-green-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-green-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-green.png")
          ];
        case "ferrari":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-ferrari-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-ferrari.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-ferrari-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-ferrari-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-ferrari-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-ferrari.png")
          ];
        case "gold":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-gold-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-gold.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-gold-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-gold-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-gold-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-gold.png")
          ];
        case "amethyst":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-amethyst-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-amethyst.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-amethyst-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-amethyst-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-amethyst-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-amethyst.png")
          ];
        case "bluegreen":
          return [
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-0.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-icon-bluegreen-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-bluegreen.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-bluegreen-1.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-bluegreen-2.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-icon-bluegreen-3.png"),
            require("../../../assets/img/agent-center-new/open-link/open-share-holder-bluegreen.png")
          ];
        }
      }
    },
    noDataImg(){
      if(this.$config.blackTheme || this.$config.newQP) {
        return require('@src/assets/img/yellow.png')
      } else if (this.$config.blush) {
        return require('@src/assets/img/blush.png')
      }else if (this.targetTheme && this.targetTheme['code']) {
        let  matchResult = this.targetTheme['code']
        return require(`@src/assets/img/${matchResult}.png`)
      } else {
        return require('@src/assets/img/no-data.png')
      }
    },
  },
  methods: {
    //滑动开始
		touchStart(e){
			this.startX = e.touches[0].clientX;
    },
    //滑动结束
		touchEnd(e){
      let parentElement = e.currentTarget.parentElement;
			this.endX = e.changedTouches[0].clientX;
			if( parentElement.dataset.type == 0 && this.startX - this.endX > 50  ){
				this.restSlide();
				parentElement.dataset.type = 1;
			}
			if( parentElement.dataset.type == 1 && this.startX - this.endX < -50 ){
				this.restSlide();
				parentElement.dataset.type = 0;
			}
			this.startX = 0;
			this.endX = 0;
    },
    //判断是否滑动
    checkSlide(){
      let listItems = document.querySelectorAll('.link-item');
			for( let i = 0 ; i < listItems.length ; i++){
        if( listItems[i].dataset.type == 1 ) {
          return true;
        }
      }
      return false;
    },
    deleteLink(item){
      let id;
      if(item) id = item.id;
      this.$store.dispatch("agency/agencyLinkDeleted", {
        id:id
      }).then(res=>{
          if(res.code == 200){
            this.restSlide()
            this.onRefresh('deleted')
            this.toastText('删除成功', "top");
            this.$refs["list"] && this.$refs["list"].loaded();
            this.$refs['list'].scroll.scrollTo(0, 0, 0)
          }
          else{
            this.toastText(res.message, "top");
          }
      }).catch(err => {
        this.$refs["list"] && this.$refs["list"].loaded();
        this.toastText("删除失败", "top");
      });
    },
    restSlide(){
			let listItems = document.querySelectorAll('.link-item');
			for( let i = 0 ; i < listItems.length ; i++){
				listItems[i].dataset.type = 0;
			}
		},
    getValList() {
      if (isNaN(this.editIndex)) return [];
      else if (this.personalMode === "mode_a") return this.dates;
      else {
        const dates = [0];
        const max = parseFloat(
          this.getMax(
            this.$store.state.agency.refundRebate[this.editIndex].list
          ).val
        );
        for (let i = 0; i < max; i += 0.1) {
          if(Math.round(i * 10 + 1) / 10<=max){ dates.push(Math.round(i * 10 + 1) / 10);}
         
        }
        return dates;
      }
    },
    getMaxDiff(index) {
      if (this.personalMode === "mode_a") return 0.3;
      else
        return parseFloat(
          this.getMax(this.$store.state.agency.refundRebate[index].list).val
        );
    },
    onSave() {
      Html2Canvas(this.$refs.pic).then(canvas => {
        // 将 canvas 导出成 base64
        const base64 = canvas.toDataURL("image/png");

        // 添加图片到预览
        // const img = new Image()
        // img.style.display = 'block'
        // img.style.position = 'fixed'
        // img.style.zIndex = '9999'
        // img.style.left = '0'
        // img.style.top = '0'
        // img.src = base64
        // document.body.appendChild(img)

        this.savePicture(
          base64,
          "推广海报_" + this.dayJs().format("YYYY-MM-DD_HH:mm:ss")
        );
      });
    },
    onLook(item) {
      this.$store.state.agency.openDataForLook = item;
      localStorage["open-data-look"] = JSON.stringify(item);
      this.$router.push("/user/agency-center-new/open/look");
    },
    onCopy(item) {
      if (!item) return;
      if (this.siteModel === "invite_link") {
        this.$copyText(`${item["domain"]}`)
      } else {
        this.$copyText(`${window.location.origin}\n邀请码: ${item['agencyCode']}`)
      }
      this.toastText("复制成功", "top");
    },
    onRefresh(type) {
      this.page = 0;
      this.totalCount = 0;
      this.noMore = false;
      this.loading = false;
      this.loadList(true,type);
    },
    onLoadMore() {
      this.loadList();
    },
    loadList(status,type) {
      if (this.noMore) {
        this.toastText('没有更多', 'top')
        this.$refs["list"] && this.$refs["list"].loaded();
      } else if (!this.loading) {
        this.page++;
        this.loading = true;
        this.$store.dispatch("agency/getInviteList", {
            page: this.page,
            limit: this.limit
          }).then(res => {
            this.loaded = true;
            this.loading = false;
            this.$refs["list"] && this.$refs["list"].loaded();
            if (res.code === 200) {
              if (res.data.data.length) {
                if (status) this.list = res.data.data;
                else this.list = this.list.concat(res.data.data);

                if(JSON.parse(localStorage.siteConfig).home == 'tc' ){
                  let newList = []
                  this.list.map(ff=>{
                    ff.platform = ff.platform.filter(dd=>{
                      return dd.type_en == "LOTTERY" || dd.type_en == "CHESS"
                    })
                    return ff
                  })
                }
                if (this.personalMode === "mode_b" && this.$refs["qr-code"]) {
                  this.$refs["qr-code"].innerHTML = ''
                  this.qr = new QRCode(this.$refs["qr-code"], {
                    text: this.list[0]["domain"],
                    width: 3 * this.rem,
                    height: 3 * this.rem
                  });
                }
                this.totalCount = this.totalCount + res.data.data.length;
              } else {
                this.noMore = true;
                if (this.page === 1 && !type) {
                  this.$router.push("/user/agency-center-new/open/link/null");
                }else if(this.page === 1 &&type=='deleted'){
                  this.$router.push("/user/agency-center-new");
                }
              }
            } else {
              this.page--;
              this.toastText(res.message, "top");
            }
          })
          .catch(err => {
            console.log(err)
            this.loading = false;
            this.$refs["list"] && this.$refs["list"].loaded();
            this.page--;
            this.toastText("获取数据失败", "top");
          });
          setTimeout(()=>{
           if(this.list.length>0 && this.list[0].domain){
              this.$copyText(this.list[0].domain)
           }
          },500)
      }
    },

    /**
     * 开户提交
     */
    onSubmit() {
      this.$store.state.agency.username=this.inviteUserName
       this.$copyText(`平台名登录地址: ${window.location.origin}\n帐号:${this.$store.state.agency.username}\n密码:${this.$store.state.agency.password}`)
      if (this.submitting) {
        // this.toastText("正在提交,请勿重复提交", "top");
      } else if (!this.$store.state.agency.username.trim()) {
        this.toastText("请输入开户帐号", "top");
      } else if (
        !/[A-z\d]{6,10}/.test(this.$store.state.agency.username.trim() || "")
      ) {
        this.userErr = true;
        this.toastText("帐号6-10位字母或数字", "top");
      } else {
        let username = '';
        this.submitting = true;
        this.userErr = false;
        this.userChecking = true;
        this.$store
          .dispatch(
            "user/checkUserName",
            this.$store.state.agency.username.trim()
          )
          .then(res => {
            this.userChecking = false;
            if (res.status === 200) {
              if (res.data.code === 200) {
                this.userErr = false;
                const json = {};
                for (let k in this.$store.state.agency.refundRebateForOpen) {
                  if (
                    this.$store.state.agency.refundRebateForOpen.hasOwnProperty(
                      k
                    )
                  ) {
                    this.$store.state.agency.refundRebateForOpen[
                      k
                    ].list.forEach(item => {
                      json[item["platform_en"]] = item.val;
                    });
                  }
                }
                this.$store
                  .dispatch("agency/createAccount", {
                    account_type:
                      this.personalMode === "mode_b" ? 0 : this.userType,
                    account_name: this.$store.state.agency.username.trim(),
                    account_password: this.$store.state.agency.password.trim(),
                    json: JSON.stringify(json)
                  })
                  .then(res => {
                    this.submitting = false;
                    if (res.code === 200) {
                      
                      username = this.$store.state.agency.username;
                        this.showIosAlert({
                          title: "开户成功",
                          content:'帐号、密码已复制',
                          okText: '确定' ,
                          showNo:false,
                          okCallback: () => {
                            this.$store.state.main.iosAlert.show = false
                          }
                        })
                        setTimeout(()=>{
                           this.$store.state.main.iosAlert.show = false
                        },3000)
                      this.$store.state.agency.refundRebateForOpen = JSON.copyObj(
                        this.$store.state.agency.refundRebate
                      );
                      this.inviteUserName=''
                      this.userType = 1;
                    } else {
                      this.toastText(res.message, "top");
                    }
                  })
                  .catch(() => {
                    this.submitting = false;
                    this.toastText("网络错误", "top");
                    this.opening = false;
                  });
                  // setTimeout(()=>{
                  //   console.log(this)
                  //   this.$copyText(`平台名登录地址: ${window.location.origin}\n帐号:${this.$store.state.agency.username}\n密码:${this.$store.state.agency.password}`)
                  // },500)
              } else {
                this.userErr = true;
                this.submitting = false;
                this.toastText(res.data.message, "top");
              }
            } else {
              this.submitting = false;
              this.toastText("检查用户名失败", "top");
            }
          })
          .catch(err => {
            this.submitting = false;
            this.userChecking = false;
            this.toastText("检查用户名失败", "top");
          });
      }
    },

    /**
     * 检查用户名是否被使用
     */
    onCheckName() {
      if (!this.$store.state.agency.username.trim()) {
        this.userErr = true;
      } else if (
        !/[A-z\d]{6,10}/.test(this.$store.state.agency.username.trim() || "")
      ) {
        this.userErr = true;
        this.toastText("帐号6-10位字母或数字", "top");
      } else {
        this.userErr = false;
        if (!this.userChecking) {
          this.userChecking = true;
          this.$store
            .dispatch(
              "user/checkUserName",
              this.$store.state.agency.username.trim()
            )
            .then(res => {
              this.userChecking = false;
              if (res.status === 200) {
                if (res.data.code === 200) {
                  this.userErr = false;
                } else {
                  this.userErr = true;
                  this.toastText(res.data.message, "top");
                }
              } else {
                this.toastText("检查用户名失败", "top");
              }
            })
            .catch(err => {
              this.userChecking = false;
              this.toastText("检查用户名失败", "top");
            });
        }
      }
    },
    /**
     * 下拉选择
     */
    onSelect(index) {
      setTimeout(() => {
        this.editIndex = index;
        const list = this.$store.state.agency.refundRebateForOpen[
          this.editIndex
        ].list;
        this.editVal = this.getMaxDiffItem(list)["subValue"] || 0;
        this.showSelector = true;
      }, 100);
    },
    /**
     * 下拉选择
     */
    onRebateSelect(val) {
      this.showSelector = false;
      if (!isNaN(this.editIndex)) {
        val = parseFloat(val);
        const baseVal = this.getMaxDiffItem( this.$store.state.agency.refundRebateForOpen[this.editIndex].list )["subValue"] || 0;
        if (val > baseVal) {
          this.onAdd(this.editIndex, val - baseVal);
        } else if (val < baseVal) {
          if(val < this.editMax){
             this.onSub(this.editIndex, baseVal - val,val);
          }else{
             this.onSub(this.editIndex, baseVal - val);
          }
        }
      }

      this.editIndex = NaN;
    },

    /**
     * 转一位小数
     */
    getFloatOne(val) {
      val = parseFloat(val);
      if (!val) return "0";
      else if (!val.toString().includes(".")) return val + ".0";
      else return val.toString();
    },

    /**
     * 类型中整体加1
     * @param index
     * @param val
     */
    onAdd(index, val) {
      val = val || 0.1;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          const baseValue = parseFloat(this.$store.state.agency.refundRebate[index].list[i].val);
          if (!item["subValue"]) item["subValue"] = 0;
          let value = Math.round(item["subValue"] * 10 + val * 10) / 10;
          let editMax;
          if (this.personalMode === 'mode_a'){
            if(item.platform_en == "CT_LOTTERY") editMax = parseFloat(this.$store.state.agency.refundRebate[index].list[i].val);
            else editMax = this.editMax
          }
          else editMax = parseFloat( this.$store.state.agency.refundRebate[index].list[i].val );
          if (value > editMax) value = editMax;
          else if(value >baseValue) value = baseValue;
          item["subValue"] = (value*1).toFixed(1);
          item.val = this.getFloatOne(Math.round(baseValue * 10 - item["subValue"] * 10) / 10);
        }
      );
      this.$set(
        this.$store.state.agency.refundRebateForOpen,
        index,
        this.$store.state.agency.refundRebateForOpen[index]
      );
    },

    /**
     * 类型中整体减1
     * @param index
     * @param val
     */
    onSub(index, val,currentVal) {
      val = val || 0.1;
      let value
      let getMaxDiffItem = this.getMaxDiffItem(this.$store.state.agency.refundRebateForOpen[index].list).subValue;
      this.$store.state.agency.refundRebateForOpen[index].list.forEach(
        (item, i) => {
          let editMax = parseFloat(this.$store.state.agency.refundRebate[index].list[i].val);
          if (!item["subValue"]) item["subValue"] = 0;
          if(item.platform_en == "CT_LOTTERY"){getMaxDiffItem>editMax?(!isNaN(currentVal)?value= currentVal:value=editMax):value = Math.round(item['subValue'] * 10 - val * 10) / 10 }
          else value = Math.round(item["subValue"] * 10 - val * 10) / 10;
          if (value < 0) value = 0;
          item["subValue"] = parseFloat(value)==0?0:(value*1).toFixed(1)
          const baseValue = parseFloat( this.$store.state.agency.refundRebate[index].list[i].val );
          item.val = this.getFloatOne(
            Math.round(baseValue * 10 - item["subValue"] * 10) / 10
          );
        }
      );
      this.$set( this.$store.state.agency.refundRebateForOpen,index,this.$store.state.agency.refundRebateForOpen[index]
      );
    },

    /**
     * 获取类型中的最大值
     * @param list
     * @returns {Object}
     */
    getMax(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.val.toString());
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },

    /**
     * 获取类型中的最大 差值
     * @param list
     * @returns {Object}
     */
    getMaxDiffItem(list) {
      let index = 0;
      let val = 0;
      list.forEach((item, i) => {
        const v = parseFloat(item.subValue || 0);
        if (v > val) {
          val = v;
          index = i;
        }
      });
      return list[index];
    },

    /**
     * 区分背景图
     * @param item
     * @returns {string}
     */
    getLabelClass(item) {
      return "label-" + item["type_en"].toLowerCase();
    }
  }
};
</script>

<style lang="less" type='text/less' scoped>
.black-van-picker {
  background: linear-gradient(0deg, #0B0B0B, #100F0F);
  /deep/ .van-picker__toolbar {
    .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
      color: #fff !important;
    }
    &::after {
      border: none !important;
    }
  }
  /deep/ .van-picker__columns {
    background: linear-gradient(0deg, #0B0B0B, #100F0F);
    .van-picker-column__item {
      color: #fff;
    }
  }
  /deep/ .van-picker__mask {
    background: none;
  }
}
 .blush-van-picker {
    background: linear-gradient(0deg, #530107, #7E010C);
    /deep/ .van-picker__toolbar {
      .van-picker__cancel, .van-picker__title ,.van-picker__confirm{ 
        color: #fff !important;
      }
    }
    /deep/ .van-picker__columns {
      background: linear-gradient(0deg, #530107, #7E010C);
      .van-picker-column__item {
        color: #fff;
      }
    }
    /deep/ .van-picker__mask {
      background: none;
    }
  }
.black-tab {
  /deep/ .van-tabs {
    .van-tabs__wrap{
        .van-tabs__nav {
            background: linear-gradient(0deg, #0C0C0C, #222222) !important;
            .van-tab {
                color: #fff;
            }
        }
        .van-tab--active {
            color: #F6CF32 !important;
        }
        .van-tabs__line {
            background-color: #F6CF32 !important;
        }
    }
    &::after {
        border-color: #242424 !important;
    }
  }
}
.blush-tab {
  /deep/ .van-tabs {
    .van-tabs__wrap{
        .van-tabs__nav {
            background: linear-gradient(180deg, #95000D 0%, #72010B 100%) !important;
            .van-tab {
                color: #fff;
            }
        }
        .van-tab--active {
            color: #F6CF32 !important;
        }
        .van-tabs__line {
            background-color: #F6CF32 !important;
        }
    }
    &::after {
        border-color: transparent !important;
    }
  }
}
/deep/ .van-picker {
  width: 7.18rem;
  margin: 0 auto;
  border-top-left-radius: 0.1rem;
  border-top-right-radius: 0.1rem;
}

/deep/ .van-picker__toolbar::after {
  border-top: none;
}

.agent-open {
  /deep/ .van-field__control {
    z-index:1;
    color: #444444 !important;
  }

  /deep/ .van-field__control:disabled {
    color: #444444 !important;
  }

  // /deep/ .van-field--error .van-field__control {
  //   color: #e71414 !important;
  // }

  // /deep/ .van-field--error .van-field__control::placeholder {
  //   color: #e71414 !important;
  // }

  /deep/ .no-link::after {
    content: none;
  }

  /deep/ .van-cell__value {
    overflow: visible;
  }

  /deep/.vux-swiper{
    height:auto!important;
    .vux-swiper-item{
      position: relative;
    }
  }

  /deep/ .van-cell::after {
    left: 1.8rem;
    width: 80%;
  }

  /deep/ .van-field__label {
    font-size: 0.3rem;
    color: #444444;
  }

  /deep/ .van-field__control {
    font-size: 0.3rem;
  }

  /*/deep/ .van-cell-group > *:last-child::after {*/
  /*  content: none !important;*/
  /*}*/
  .border_l{border-radius:0.05rem;border-radius: 10% 0% 0% 10%;font-size: 0.42rem !important}
  .border_r{border-radius:0.05rem;border-radius: 0% 10% 10% 0%;}
  .view-box {
    padding: 0;
   }
    .lotter-link{
      width:100%;
    }
    .lotter-user{
      width:100%;
    }
  .info {
    margin: 0 auto 0.24rem auto;
    width: 7.18rem;
    height: 0.72rem;
    border-radius: 0.1rem;
    background-color: #fff0e6;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #ff7c5b;
    font-size: 0.28rem;
    padding: 0.16rem;
    box-sizing: border-box;

    .van-icon {
      font-size: 0.36rem;
      margin-right: 0.06rem;
    }
  }

  .van-cell {
    height: 0.9rem;
    position: initial;
  }

  .user-type-select {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.3rem;

    .user-type-item {
      border-radius: 0.1rem;
      height: 0.72rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.36rem;
      border: 0.02rem solid #2c93ff;
      color: #2c93ff;
      margin-right: 0.3rem;

      &.active {
        background-color: #2c93ff;
        color: #ffffff !important;
      }
    }
  }

  .link {
    padding-bottom: 0.24rem;
    .link-item[data-type="0"]{
      transform: translate3d(0,0,0);
      .link-right{
        opacity:0;
      }
    }
    .link-item[data-type="1"]{
      border-radius:0;
      transform: translate3d(-2rem,0,0);
      .is-agent-1{
        border-top-right-radius: 0rem;
      }
      .link-right{
        opacity:1;
      }
    }
    .link-item:after{
        content: " ";
        position: absolute;
        left: 0.2rem;
        bottom: 0;
        right: 0;
        height: 1px;
        // border-bottom: 1px solid #ccc;
        color: #ccc;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        z-index: 2;
    }
    .link-item {
      margin-top: 0;
      margin-bottom: 0.24rem;

      &:last-child {
        margin-bottom: 0;
      }

      .link-info {
        padding: 0.24rem;
        position: relative;

        .link-content-row {
          font-size: 0.32rem;
          color: #444444;
          line-height: 0.45rem;
          width: 5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          text-align: left;
          margin-bottom: 0.24rem;
        }

        .link-info-row {
          font-size: 0.3rem;
          color: #444444;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          height: 0.42rem;
          display: flex;

          .value {
            color: #e71414;
          }
        }
      }

      .link-info::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0.2rem;
        bottom: 0;
        // top: 0;
        left: 0rem;
        border-bottom: 0.02rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .link-action {
        height: 0.72rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem 0;

        .link-action-item {
          width: 50%;
          color: #2c93ff;
          font-size: 0.28rem;

          &:first-child {
            // border-right: 0.02rem solid #e7e7e7;
            position: relative;
            &::after{
              position: absolute;
              box-sizing: border-box;
              content: ' ';
              pointer-events: none;
              right: 0;
              bottom: 0;
              top: 0;
              // left: 0rem;
              border-right: 0.03rem solid #ebedf0;
              -webkit-transform: scaleX(.5);
              transform: scaleX(.5);
            }
          }
        }
      }

      .is-agent-0 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.88rem;
        height: 0.46rem;
        background-color: #fbc46f;
        border-top-right-radius: 0.1rem;
        border-bottom-left-radius: 0.1rem;
        color: #ffffff;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 0.26rem;
      }

      .is-agent-1 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.88rem;
        height: 0.46rem;
        background-color: #fb8d6f;
        border-top-right-radius: 0.1rem;
        border-bottom-left-radius: 0.1rem;
        color: #ffffff;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 0.26rem;
      }
      .link-right{
        width: 2rem;
        height:2.30rem;
        background: #E74848;
        font-size: 17px;
        color: #fff;
        text-align: center;
        line-height: 1.6rem;
        position: absolute;
        top:0;
        right: -2rem;
        box-shadow:0px 2.5px 2.5px 0px rgba(0,0,0,0.03);
        border-radius:0px 5px 5px 0px;
        .link-delete{
          text-align: center;
          line-height:2.30rem;
          font-size: 0.36rem;
        }
      }
    }
  }

  .user {
    .rebate-item {
      height: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      overflow: visible !important;

      .bmg {
        left: 0;
        top: -0.04rem;
        width: 1.88rem;
        height: 1.82rem;
        position: absolute;
        border-radius: 0.16rem 0px 0px 0.16rem;
      }

      .label {
        height: 100%;
        width: 100%;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        background-position: 0 0;
        background-size: 100%;
        background-repeat: no-repeat;
        font-size: 0.36rem;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(255,255,255,1);
        &.label-live {
          background-image: url("../../../assets/img/agent-center-new/label-live.png");
        }

        &.label-lottery {
          background-image: url("../../../assets/img/agent-center-new/label-lottery.png");
        }

        &.label-sport {
          background-image: url("../../../assets/img/agent-center-new/label-sport.png");
        }

        &.label-game {
          background-image: url("../../../assets/img/agent-center-new/label-slot.png");
        }

        &.label-chess {
          background-image: url("../../../assets/img/agent-center-new/label-chess.png");
        }
        &.label-fish {
          background-image: url("../../../assets/img/agent-center-new/label-fish.png");
        }
      }

      .rebate-box {
        padding: 0.15rem 0 0.15rem 2.58rem;
        flex: 1;
        height: 100%;
        text-align: left;
        font-size: 0.3rem;
        color: #444444;
        white-space: nowrap;

        .info-row {
          line-height: 0.42rem;
          margin-bottom: 0.25rem;

          .span {
            display: inline-block;
            width: 0.4rem;
          }

          .value {
            color: #e71414;
          }
        }

        .edit-row {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 0.56rem;
          width: 100%;
          white-space: nowrap;
          flex-wrap: nowrap;

          .edit-label {
            margin-right: 0.2rem;
          }

          .edit-action {
            font-size: 0.3rem;
            font-family: Arial, sans-serif;
            color: #999999;
            font-weight: 500;
            border: 0.02rem solid #dbdbdb;
            width: 0.56rem;
            height: 0.56rem;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;

            &.h5-icon-icon-subtract {
              border-top-left-radius: 0.06rem;
              border-bottom-left-radius: 0.06rem;
            }

            &.h5-icon-icon-plus {
              border-top-right-radius: 0.06rem;
              border-bottom-right-radius: 0.06rem;
            }

            &.disabled {
              color: #EAEAEA;
            }
          }

          .edit-value {
            border-top: 0.02rem solid #dbdbdb;
            border-bottom: 0.02rem solid #dbdbdb;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 0.56rem;
            width: 1.3rem;
          }
        }
      }

      .van-icon {
        font-size: 0.3rem;
        color: #999999;
        padding-right: 0.1rem;
      }
    }
  }

  .box-footer {
    padding: 0.16rem;
  }

  .no-link{
    display: flex;
    .title{
      font-size: 0.3rem;
      color: #444444;
      width: 1.8rem;
      line-height: 0.72rem;
    }
    .link-type{
        font-size: 0.3rem;
        border-radius: 0.1rem;
        height: 0.72rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.36rem;
        border: 0.02rem solid #2c93ff;
        color: #2c93ff;
        margin-right: 0.3rem;
      &.active {
        background-color: #2c93ff;
        color: #ffffff !important;
      }
    }
  }

  .btn-user {
    width: 7.18rem;
    height: 0.96rem;
    border-radius: 0.1rem;
    background-color: #2c93ff;
    color: #ffffff;
    font-size: 0.38rem;
    display: inline-block;
    text-align: center;
    // display: flex;
    justify-content: center;
    // align-items: center;
    margin: 0 auto;
  }

  .btn-user-link {
    width: 7.18rem;
    height: 0.96rem;
    border-radius: 0.1rem;
    background-color: #2c93ff;
    color: #ffffff;
    font-size: 0.38rem;
    // display: flex;
    display: inline-block;
    text-align:center;
    // justify-content: center;
    // align-items: center;
    margin: 0 auto;
    box-shadow: 0 -0.06rem 0.05rem 0 rgba(0, 0, 0, 0.03);
  }

  .shore {
    .active-box {
      padding: 0.72rem 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn-save {
        width: 3.2rem;
        height: 0.96rem;
        // color: #ffffff;
        border-radius: 0.1rem;
        background-color:#fff;
        font-size: 0.38rem;
      }

      .btn-copy {
        width: 3.2rem;
        height: 0.96rem;
        background-color: #2c93ff;
        color: #ffffff;
        border-radius: 0.1rem;
        font-size: 0.38rem;
      }
    }

    .view-box {
      padding: 0 0 0.64rem 0;
      width: 6.7rem;
      margin: 0 auto;
    }

    .shore-shareholder {
      width: 6.7rem;
      margin: 0 auto;

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.68rem;
        margin-bottom: 0.64rem;
        padding: 0 0.32rem;
        height: 0.64rem;

        .info-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          font-size: 0.3rem;
          color: #444444;

          .icon {
            width: 0.64rem;
            height: 0.64rem;
            display: block;
            margin-right: 0.08rem;
          }
        }
      }
    }

    .shore-agent {
      width: 6.7rem;
      margin: 0 auto;

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.32rem;
        margin-bottom: 0.56rem;
        padding: 0 0.32rem;

        .info-row-item {
          width: 1.5rem;

          .icon {
            display: block;
            width: 0.8rem;
            height: 0.8rem;
            margin: 0 auto;
          }

          .info-1 {
            font-size: 0.24rem;
            color: #666666;
            line-height: 0.33rem;
            margin-top: 0.16rem;
          }

          .info-2 {
            font-size: 0.24rem;
            color: #444444;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 0.5rem;

            .num {
              display: block;
              height: 0.36rem;
              line-height: 0.36rem;
              color: #2c93ff;
              font-size: 0.36rem;
              font-weight: 500;
              margin: 0 0.1rem;
            }
          }
        }
      }
    }

    .qr-code {
      width: 3rem;
      height: 3rem;
      margin: 0 auto;
    }

    .code-info {
      margin-top: 0.4rem;
      font-size: 0.3rem;
      color: #444444;
      font-weight: 500;
    }
  }
}
.black-scroll {
  /deep/ .van-field {
    .van-cell__title {
      text-align: center;
      color: #fff;
    }
    .van-field__body input {
      color: #fff !important;
    }
  }
  .no-link{
    .link-type.active{
      border: none !important;
      color: #000 !important;
    }
  }
}
</style>
