<template>
  <view-page full-box>
    <div class="content" slot="content">
      <div class="box">
        <div class="top-list">
          <ul>
            <li><img src="../../../../assets/img/agent/odds.png" alt=""><span>业界<br>最高赔率</span></li>
            <li><img src="../../../../assets/img/agent/setting.png" alt=""><span>稳定的<br>游戏环境</span></li>
            <li><img src="../../../../assets/img/agent/games.png" alt=""><span>最全的<br>游戏种类</span></li>
            <li><img src="../../../../assets/img/agent/point.png" alt=""><span>实时的<br>代理佣金</span></li>
          </ul>
        </div>
        <div class="notice">
          {{$config.siteName}}丰富的娱乐游戏，打造全新的代理模式，业界佣金最高，系统将实时为您结算佣金，佣金不计洗码量可直接出款。
        </div>
        <div class="notice-two">
          请务必确认您的会员帐号及财务信息是否正确有效，否则不能出款。
        </div>
        <div class="cen-list">
          <ul>
            <li><img src="../../../../assets/img/agent/agent.png" alt=""><span>代理佣金</span></li>
            <li><img src="../../../../assets/img/agent/self.png" alt=""><span>自身佣金</span></li>
            <li><img src="../../../../assets/img/agent/team.png" alt=""><span>团队佣金</span></li>
            <span class="add"><img src="../../../../assets/img/agent/add.png" alt=""></span>
            <span class="result"><img src="../../../../assets/img/agent/result.png" alt=""></span>
          </ul>
        </div>
        <div class="bottom-list">
          <ul>
            <li>
              <div class="title"><span>01</span><span>自身佣金计算方式</span></div>
              <div class="text">彩票：自身有效洗码量总和 x 0.6%<br>
                视讯,体育,棋牌,电子：自身有效洗码量总和 x 0.1%
              </div>
            </li>
            <li>
              <div class="title"><span>02</span><span>团队佣金计算方式</span></div>
              <div class="text" v-if="personalMode==='mode_b'">彩票：团队有效洗码量总和 x 0.6%<br>
                视讯,体育,棋牌,电子：团队有效洗码量总和 x 0.1%
              </div>
              <div class="text" v-if="personalMode==='mode_a'">彩票,视讯,体育,棋牌,电子：团队有效洗码量总和 x 分润点
              </div>
            </li>
            <li>
              <div class="title"><span>03</span><span>代理有效会员保证</span></div>
              <div class="text">实时结算，必须“有效会员”不低于3人或以上<br>
                (有效会员必须为存款大于等于500，非有效会员洗<br>码量不列入佣金)
              </div>
            </li>
          </ul>
        </div>
        <div class="map">
          <img v-if="personalMode==='mode_b'" src="../../../../assets/img/agent/map.png" alt="">
          <img v-if="personalMode==='mode_a'" src="../../../../assets/img/agent/map_b.png" alt="">
        </div>
        <div class="notice-three" v-if="personalMode==='mode_b'">
          例如：A代理发展B会员和C会员则A代理佣金=A(彩票) x 0.6%+A(视讯,体育,棋牌,电子) x 0.1%+ (B+C)(彩票) x 0.6% + (B+C)(视讯,体育,棋牌,电子) x 0.1%
        </div>
        <div class="notice-three" v-if="personalMode==='mode_a'">
          例如：A代理发展B和C代理，C代理发展D和E代理
          则A代理佣金=A(彩票) x 0.6%+A(视讯,体育,棋牌,电子) x 0.1%
          + (B+C+D+E)(彩票,视讯,体育,棋牌,电子) x 分润点
        </div>
        <div class="bottom-tab">
          <div class="tab">
            <img src="../../../../assets/img/agent/countTime.png" alt="">
            <span>佣金计算时间</span>
            <span>实时</span>
          </div>
          <div class="tab">
            <img src="../../../../assets/img/agent/openTime.png" alt="">
            <span>佣金发放时间</span>
            <span>实时</span>
          </div>
        </div>
        <p class="power">
          李嘉诚说他这辈子都在做的三件事：<br>
          1. 赶趋势<br>
          2. 抓机遇<br>
          3. 找平台<br>
          这个时代不是苦干蛮干就能赚钱，而是要懂得发现新的机会，与时俱进把握趋势！<br>
          您不上台演出，永远只是观众，与其看着您身边的资源去别的网站娱乐，不如介绍他来{{$config.siteName}}注册会员下注，无论输赢，您都能获得实时返利佣金，真正实现躺赚百万不是梦！<br>
        </p>
        <div class="bottom-title">{{$config.siteName}}就是您赚钱的最好平台</div>
        <p class="powerTwo">* 最终解释权归本站所有</p>
      </div>
    </div>
  </view-page>
</template>

<script>
export default {
  name: 'MoneyRuleApp',
  computed: {
    app () {
      return this.$route.query.app
    }
  }
}
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0.3rem 0;

    .box {
      width: 7.14rem;
      border-radius: 10px;
      box-shadow: -1px 2px 20px #ccc;
      margin: auto;
      padding-bottom: 0.2rem;

      .top-list {
        width: 7.14rem;
        border-radius: 10px;
        margin: auto;
        border-bottom: 1px solid #DCE3ED;
        padding: 0.5rem 0 0 0;

        ul {
          width: 100%;
          display: flex;

          li {
            width: calc(100% / 4);
            height: 100%;
            border-right: 1px solid #DCE3ED;

            img {
              display: block;
              width: 0.72rem;
              height: 0.68rem;
              margin: auto;
            }

            span {
              display: block;
              margin: auto;
              margin-top: 0.13rem;
              width: 100%;
              font-size: 0.32rem;
              color: #333333;
              line-height: 0.35rem;
              font-weight: bold;
              padding-bottom: 0.2rem;
            }
          }

          li:last-of-type {
            border: none;
          }
        }
      }

      .notice {
        width: 6.9rem;
        margin: auto;
        margin-top: .4rem;
        font-size: 0.3rem;
        color: #333333;
        text-align: left;

        .tit {
          color: #4D8FFA;
          font-size: 0.4rem;
        }
      }

      .notice-two {
        width: 6.82rem;
        height: 0.75rem;
        font-size: 0.3rem;
        margin: auto;
        margin-top: .5rem;
        color: #4D8FFA;
        text-align: left;
        font-weight: bold;

      }

      .cen-list {
        width: 7.13rem;
        height: 2.37rem;
        margin: auto;

        ul {
          width: 100%;
          height: 100%;
          margin-top: 0.28rem;
          display: flex;
          justify-content: space-around;
          position: relative;

          li {
            width: 2.11rem;
            height: 100%;

            img {
              width: 100%;
              display: block;
            }

            span {
              width: 100%;
              text-align: center;
              display: block;
              font-size: 0.32rem;
              color: #333333;
              font-weight: bold;
              margin-top: -0.2rem;
            }
          }

          .add {
            position: absolute;
            display: block;
            width: 0.4rem;
            right: 2.15rem;
            top: 0.8rem;

            img {
              width: 100%;
              display: block;
            }
          }

          .result {
            position: absolute;
            display: block;
            width: 0.4rem;
            left: 2.15rem;
            top: 0.8rem;

            img {
              width: 100%;
              display: block;
            }
          }
        }
      }

      .bottom-list {
        width: 6.88rem;
        margin: auto;

        ul {
          margin-top: 0.99rem;
          width: 100%;

          li {
            border-bottom: 1px solid #E9E9E9;
            padding-bottom: 0.48rem;
            margin-top: 0.48rem;

            .title {
              width: 100%;
              height: 0.5rem;
              line-height: 0.5rem;

              span:nth-of-type(1) {
                display: block;
                width: 0.5rem;
                height: 0.5rem;
                font-size: 0.32rem;
                color: #fff;
                border-radius: 50%;
                background: #4D8FFA;
                float: left;
              }

              span:nth-of-type(2) {
                height: 0.5rem;
                line-height: 0.5rem;
                color: #4D8FFA;
                font-size: 0.32rem;
                float: left;
                margin-left: 0.32rem;
                font-weight: bold;
              }
            }

            .text {
              width: 100%;
              text-align: left;
              font-size: 0.3rem;
              margin-top: 0.28rem;
            }
          }
        }
      }

      .map {
        width: 4.84rem;
        margin: auto;

        img {
          display: block;
          width: 100%;
          margin: 0.59rem auto;
        }
      }

      .notice-three {
        width: 6.85rem;
        margin: auto;
        font-size: 0.3rem;
        color: #333333;
        text-align: left;
      }

      .bottom-tab {
        width: 6.85rem;
        height: 2.4rem;
        display: flex;
        justify-content: space-around;
        margin: auto;
        margin-top: 0.4rem;

        .tab {
          width: 2.7rem;
          height: 2.7rem;
          border: 1px solid #4D8FFA;
          border-radius: 50%;

          img {
            width: 0.58rem;
            display: block;
            margin: auto;
            margin-top: 0.41rem;
          }

          span:nth-of-type(1) {
            width: 100%;
            display: block;
            text-align: center;
            color: #333333;
            font-size: 0.32rem;
            font-weight: bold;
            margin-top: 0.19rem;
          }

          span:nth-of-type(2) {
            width: 100%;
            display: block;
            text-align: center;
            color: #4D8FFA;
            font-size: 0.32rem;
            font-weight: bold;
            margin-top: 0.2rem;
          }
        }
      }

      .power {
        width: 6.85rem;
        margin: auto;
        text-align: left;
        color: #333333;
        margin-top: 0.8rem;
        font-size: 0.3rem;
      }

      .powerTwo {
        width: 6.85rem;
        margin: auto;
        text-align: left;
        color: #333333;
        margin-top: 0.4rem;
        font-size: 0.3rem;
      }

      .bottom-title {
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.32rem;
        width: 80%;
        margin: auto;
        margin-top: 0.4rem;
        color: #fff;
        background: #4D8FFA;
        border-radius: 0.5rem 0 0.5rem 0;
      }
    }
  }
</style>
