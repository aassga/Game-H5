<template>
  <view-page class="agent-center-modec" full-box>
    <div slot="static" :style="headerStyle" v-if="$config.name !== '103qp'"></div>
    <div class="header" slot="header" v-if="!isApp">
      <title-header
        class="title"
        :style="$config.name !== '103qp' ? 'background-color: rgba(0,0,0,0) !important' : ''"
        backEvent
        @back="$router.push('/user/agency-center-modec')"
        title="代理教程"
      ></title-header>
    </div>
    <div slot="content" class="content">
      <div style="height:4.9rem" v-if="$config.name !== '103qp'"></div>
      <div v-else style="height:4.9rem;background-color:#fff">
        <video width="100%" class="mp4Video" controls autoplay playsinline webkit-playsinline poster="../../../assets/img/mp4-bg.png">
          <source src="../../../assets/mp4/DL.mp4" type="video/mp4">
        </video>
      </div>
      <div class="view-cont">
        <img src="@src/assets/img/agent-center-modec/desc/top-img.png" class="top-img" />
        <div class="collapse">
          <ul>
            <li v-for="(item,i) in collapseList" :key="i">
              <div :class="['title',item.showItem ? 'down' : 'up']" @click="item.showItem = !item.showItem">
                <span class="title-name">{{item.title}}</span>
                <img
                  :class="['title-img',item.showItem ? 'down' : 'up']"
                  src="@src/assets/img/agent-center-modec/desc/icon-more.png"
                />
              </div>
              <div :class="['info',item.showItem ? 'down' : 'up']">
                <div v-if="item.info && item.info.length > 0">
                  <p v-for="(info,k) in item.info" :key="k" >{{info}}</p>
                </div>
                <div v-else>
                  <img :src="item.img" alt="">
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "AgentModecDesc",
  data() {
    return {
      collapseList: [
        {
          title: "一.怎么成为代理",
          info: [
            "扫码或者点击邀请链接选择在浏览器中打开，注册下载游戏，用您的专属二维码或邀请链接去推广。",
          ],
          showItem: false
        },
        {
          title: "二.如何查看邀请码",
          info: [
            "游戏主界面，点击“推广赚钱”会有您自己的专属二维码和注册链接哦~ 保存图片就可以分享了，通过此方式注册的会员即成为您的直属代理，其邀请的下级会员皆算做您的团队成员，以此类推，可无限裂变式发展。"
          ],
          showItem: false
        },
        {
          title: "三. 佣金在哪里查看?",
          info: [
            "游戏主界面，点击“推广赚钱”，就能看到您的团队佣金、可领取佣金、洗码金额等情况。"
          ],
          showItem: false
        },
        {
          title: "四. 业绩是怎么算的?",
          info: [
            "业绩是指玩家在游戏内的有效投注，有效投注以实际结算为准"
          ],
          showItem: false
        },
        {
          title: "五. 充值提现有什么要求?",
          info: [
            "充值通道有在线充值、公司入款和代理充值通道，最低充值金额10元，最低提现金额100元，单笔提现高达50万元。通过审核后即可到账。"
          ],
          showItem: false
        },
        {
          title: "六. 怎么提现?",
          info: [
            "玩家提现是可以通过点击“提现”-“提现到银行”进行出款提现哦~ 提现绑定的银行卡和姓名一定要一致，不然无法成功提款的。"
          ],
          showItem: false
        },

        {
          title: "七. 佣金多久结算?",
          info: [
            "无限代模式返佣制度为日结算，每日23:59分清零，当日业绩达到多少按照佣金表进行返佣哦~"
          ],
          showItem: false
        },{
          title: `八. ${this.$config.setName}有哪些优势?`,
          info: [
            "① 境外集团自主研发，全新技术与银行采用128位SSL加密技术和严格的安全管理体系，确保客户的所有交易活动都是在极其严密的情况下进行。",
            "② 不用凑人，24小时真人在线，万人棋牌对战；在线匹配，自动结算，没有局数限制， 玩大玩小，玩多玩少，由您决定！",
            "③ 拥有高素质的客户服务，即时存取款，24小时实时回复玩家的在线咨询及问答，真金1:1，自由结算，大额提现秒到账。",
          ],
          showItem: false
        },
        {
          title: "九.如何计算佣金",
          img: require('../../../assets/img/agent-center-modec/desc/open-desc9.png'),
          showItem: false
        },
      ]
    };
  },
  computed: {
    headerStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "7.76rem",
        zIndex: "-1",
        backgroundImage: `url(${require("../../../assets/img/agent-center-modec/desc/desc-banner.png")})`,
        backgroundSize: "100% 100%"
      };
    },
    Mp4HanderStyle() {
      return {
        position: "absolute",
        left: "0",
        top: "0.88rem",
        width: "100%",
        zIndex: "-1",
      }
    }
  },
  created() {},
  methods: {},
  components: {}
};
</script>

<style lang="less" type='text/less' scoped>
@keyframes infoDown {
    0% {
      height: 0;
    }
    100% {
      height: auto;
    }
}
@keyframes infoUp {
    0% {
      height: auto;
    }
    100% {
      height: 0;
    }
}
.mp4Video {
  object-fit: fill;
  background-color: #fff;
}
.agent-center-modec {
  .content {
    position: relative;
    z-index: 500;

    .view-cont {
      position: relative;
      width: 7.18rem;
      padding: 0.24rem 0.24rem 0.57rem;
      margin: 0 auto .2rem;
      background-color: #fff;
      border-radius: 0.1rem;
      text-align: left;
      .top-img {
        position: absolute;
        top: -0.29rem;
        left: 50%;
        margin-left: -1.3rem;
        width: 2.6rem;
        height: 0.58rem;
      }
      .collapse {
        li {
          .title {
            position: relative;
            height: 0.95rem;
            line-height: 0.95rem;
            &.up{
              border-bottom: 0.01rem solid #e7e7e7;
            }
            &.down{
              border-bottom: none;
            }
            .title-name {
              font-size: 0.3rem;
              font-weight: bold;
              color: #444;
            }
            .title-img {
              position: absolute;
              top: 50%;
              margin-top: -0.12rem;
              right: 0;
              width: 0.13rem;
              height: 0.24rem;
              transition: all 0.15s linear;
              &.up {
                transform: rotateZ(0deg);
              }
              &.down {
                transform: rotateZ(90deg);
              }
            }
          }
          .info {
            width: 100%;
            padding: 0rem 0.24rem;
            background-color: #F6F9FF;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
            p {
              font-size: 0.28rem;
              color: #666;
              line-height: 0.42rem;
              margin-top: .32rem;
              &:last-child {
                margin-bottom: .32rem;
              }
            }
            img {
              width: 100%;
            }
            &.down{
              max-height: 99rem;
            }
            &.up{
              max-height: 0;
            }
          }
        }
      }
    }
  }
}
</style>
