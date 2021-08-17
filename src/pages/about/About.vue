<template>
  <view-page
    :class="[
      'about',
      { 'newqp-about': $config.newQP || $config.blackTheme },
      { 'blush-about': $config.blush },
      { 'aqvns-about': $config.isAqvns || $config.name === 'js85'},
      'theme-main-bg',
    ]"
    full-box
  >
    <title-header
      title="关于我们"
      slot="header"
      v-if="!isApp && this.$router.history.current.name === 'about'"
      class="theme-header-bg theme-header-bottom"
    ></title-header>
    <div
      class="wrapper_about theme-main-bg"
      slot="content"
      :style="style"
      :class="
        ['99qp', 'kkqp', 'amxpj', 'tccp','tyc86'].includes($config.name)
          ? 'specialAbout'
          : ''
      "
    >
      <div
        class="content_about"
        v-for="(item, i) in list"
        :key="i"
        v-html="item['description']"
      ></div>
    </div>
  </view-page>
</template>

<script type="text/javascript">
export default {
  name: "about",
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.$store.dispatch("main/about", {
      callback: (res) => {
        if (res.code === 200) {
          this.list = res.data;
        } else {
          this.toastText(res["message"] || res["res"], "top");
        }
      },
    });
  },
  computed: {
    style() {
      if (this.$config.name === "103qp") {
        return { padding: "0 0.2rem" };
      }
    },
  },
};
</script>

<style lang="less">
.about {
  .auto-box-content {
    /*background: url('../../assets/img/about_bg.jpg');*/
    /* background: url('../../assets/img/about_bg.png');
      background-repeat: no-repeat;
      background-size: contain;*/
    background-color: #fff;
  }
  .wrapper_about {
    width: 100%;

    .content_about {
      font-size: 0.3rem;
      /*padding: 0.14rem 0.14rem 0.9rem 0.14rem;*/
      text-align: left;
      word-break: break-all;
      .aboutContainer {
        overflow: hidden;
        /*padding-top: 3vw;*/
        padding-bottom: 10vw;
        font-family: PingFang SC;
        .part1 {
          width: 100vw;
          /*height: 144.8vw;*/
          padding-top: 3vw;
          background: url("../../assets/img/about_bg.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
        .headTop {
          margin-bottom: 3vw;
          .title {
            color: #30afff;
            font-size: 5vw;
            text-align: center;
            margin-top: 3vw;
            /*margin-bottom: 1vw;*/
            font-family: PingFang SC;
            font-weight: 800;
          }
          .title_txt {
            text-align: center;
            font-style: italic;
            font-size: 3.8vw;
            color: #000000;
            font-weight: bold;
            opacity: 0.38;
          }
        }
        .contain1 {
          position: relative;
          /*height: 133.33vw;*/
          overflow: hidden;
          .line {
            width: 0.26vw;
            height: 117.33vw;
            position: absolute;
            top: 1vw;
            left: 50%;
            margin-left: -0.13vw;
            background-image: url("../../assets/img/about/line.png");
            background-size: 100% 100%;
          }
          .items {
            .item {
              width: 54.6vw;
              overflow: hidden;
              display: flex;
              align-items: center;
              transform: translateX(6.2vw);
              margin-bottom: 4vw;
              .item1 {
                width: 41vw;
                .top {
                  color: #969696;
                  font-size: 3.2vw;
                  font-weight: 400;
                  text-align: justify;
                }
                .bottom {
                  color: #30afff;
                  font-size: 3.4vw;
                  font-weight: 800;
                  text-align: right;
                  letter-spacing: 0.2vw;
                }
              }
              .item2 {
                width: 2.2vw;
                height: 2.2vw;
                background-color: #30afff;
                border-radius: 50%;
                margin: 0 1.6vw;
              }
              .item3 {
                width: 8.2vw;
                height: 8.2vw;
                background-image: url("../../assets/img/about/icon1.png");
                background-size: 100% 100%;
              }

              &:nth-child(even) {
                width: 55.6vw;
                flex-direction: row-reverse;
                transform: translateX(39vw);
                .item1 {
                  width: 42vw;
                  .bottom {
                    text-align: left;
                  }
                }
              }
              &:nth-child(2) {
                .item3 {
                  background-image: url("../../assets/img/about/icon2.png");
                }
              }
              &:nth-child(3) {
                .item3 {
                  background-image: url("../../assets/img/about/icon3.png");
                }
              }
              &:nth-child(4) {
                .item3 {
                  background-image: url("../../assets/img/about/icon4.png");
                }
              }
              &:nth-child(5) {
                .item3 {
                  background-image: url("../../assets/img/about/icon5.png");
                }
              }
            }
          }
        }
        .contain2 {
          background-color: #f7f7f7;
          padding: 1.33vw 0;
          .items {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            .item {
              /*box-sizing: content-box;*/
              width: 28vw;
              height: 6.8vw;
              padding: 1.2vw 1.06vw;
              margin-bottom: 1.33vw;
              background-color: #fff;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .img {
                display: inline-block;
                width: 10.93vw;
                height: 4.53vw;
                background-image: url(../../assets/img/about/icon_ag.png);
                background-size: 100% 100%;
              }
              .name {
                display: inline-block;
                font-size: 2.8vw;
                /*font-weight:800;*/
              }

              &:nth-child(3n + 2) {
                margin: 0 2.4vw;
              }
              &:nth-child(2) {
                .img {
                  background-image: url(../../assets/img/about/icon_bbin.png);
                }
              }
              &:nth-child(3) {
                .img {
                  background-image: url(../../assets/img/about/icon_bg.png);
                }
              }
              &:nth-child(4) {
                .img {
                  background-image: url(../../assets/img/about/icon_th.png);
                }
              }
              &:nth-child(5) {
                .img {
                  background-image: url(../../assets/img/about/icon_ky.png);
                }
              }
              &:nth-child(6) {
                .img {
                  background-image: url(../../assets/img/about/icon_ly.png);
                }
              }
              &:nth-child(7) {
                .img {
                  background-image: url(../../assets/img/about/icon_pt.png);
                }
              }
              &:nth-child(8) {
                .img {
                  background-image: url(../../assets/img/about/icon_mg.png);
                }
              }
              &:nth-child(9) {
                .img {
                  background-image: url(../../assets/img/about/icon_jdb.png);
                }
              }
              &:nth-child(10) {
                .img {
                  background-image: url(../../assets/img/about/icon_cq9.png);
                }
              }
              &:nth-child(11) {
                .img {
                  background-image: url(../../assets/img/about/icon_pg.png);
                }
              }
              &:nth-child(12) {
                .img {
                  background-image: url(../../assets/img/about/icon_dt.png);
                }
              }
              &:nth-child(13) {
                .img {
                  background-image: url(../../assets/img/about/icon_ag.png);
                }
              }
              &:nth-child(14) {
                .img {
                  background-image: url(../../assets/img/about/icon_fg.png);
                }
              }
              &:nth-child(15) {
                .img {
                  background-image: url(../../assets/img/about/icon_jdb.png);
                }
              }
              &:nth-child(16) {
                .img {
                  background-image: url(../../assets/img/about/icon_sb.png);
                }
              }
              &:nth-child(17) {
                .img {
                  background-image: url(../../assets/img/about/icon_ss.png);
                }
              }
              &:nth-child(18) {
                .img {
                  background-image: url(../../assets/img/about/icon_im.png);
                }
              }
              &:nth-child(19) {
                .img {
                  background-image: url(../../assets/img/about/icon_ssc.png);
                }
              }
              &:nth-child(20) {
                .img {
                  background-image: url(../../assets/img/about/icon_sc.png);
                }
              }
              &:nth-child(21) {
                .img {
                  background-image: url(../../assets/img/about/icon_ks.png);
                }
              }
            }
          }
        }
        .ps {
          /*text-indent: 2em;*/
          padding: 0 5vw;
          font-size: 3.5vw;
          color: #30afff;
          margin-bottom: 4vw;
          text-align: center;
        }
        p.txt {
          padding: 0 5vw;
          /*text-indent: 2em;*/
          font-size: 3.5vw;
          text-align: justify;
          margin-bottom: 2vw;
        }
        .game {
          width: 100vw;
          height: 41.6vw;
          margin: 0 auto;
          background-image: url(../../assets/img/about/game.png);
          background-size: 100% 100%;
        }
        .safe {
          width: 78.66vw;
          height: 48.8vw;
          margin: 0 auto;
          background-image: url(../../assets/img/about/safe.png);
          background-size: 100% 100%;
        }
        .responsible {
          width: 66.53vw;
          height: 59.86vw;
          margin: 0 auto;
          background-image: url(../../assets/img/about/responsible.png);
          background-size: 100% 100%;
        }
      }
    }
  }
  .specialAbout {
    .content_about {
      .aboutContainer {
        .headTop {
          .title {
            color: #f6cf32;
          }
          .title_txt {
            color: #696969 !important;
            opacity: 1 !important;
          }
        }
        .contain1 {
          .line {
            background-image: url("../../assets/img/about/line-black.png");
          }
          .items {
            .item {
              .item1 {
                .top {
                  //color: #fff;
                }
                .bottom {
                  color: #f6cf32;
                }
              }
              .item2 {
                background-color: #f6cf32;
              }
              .item3 {
                background-image: url("../../assets/img/about/1.png");
              }
              &:nth-child(2) {
                .item3 {
                  background-image: url("../../assets/img/about/3.png");
                }
              }
              &:nth-child(3) {
                .item3 {
                  background-image: url("../../assets/img/about/2.png");
                }
              }
              &:nth-child(4) {
                .item3 {
                  background-image: url("../../assets/img/about/4.png");
                }
              }
              &:nth-child(5) {
                .item3 {
                  background-image: url("../../assets/img/about/5.png");
                }
              }
            }
          }
        }
        .ps {
          color: #f6cf32;
        }
        .safe {
          background-image: url(../../assets/img/about/safe-black.png);
        }
      }
    }
  }
  &.newqp-about {
    color: #fff;
    .auto-box-content {
      background-color: #0c0c0c;
    }
    .aboutContainer {
      .part1 {
        background: url("../../assets/img/about_black.png");
      }
      color: #fff;
      p {
        color: #fff;
        .txt {
          color: #fff;
        }
      }
      .title_txt {
        color: #fff !important;
      }
      .contain2 {
        background-color: #0c0c0c !important;
        .item {
          background-color: #101010 !important;
          color: #fff !important;
        }
      }
    }
  }
  &.blush-about {
    color: #fff;
    .auto-box-content {
      background-color: #530107;
    }
    .aboutContainer {
      .part1 {
        background: url("../../assets/img/about_blush.png");
      }
      color: #fff;
      p {
        color: #fff;
        .txt {
          color: #fff;
        }
      }
      .title_txt {
        color: #fff !important;
      }
      .contain2 {
        background-color: #530107 !important;
        .item {
          background-color: #9b010f !important;
          color: #fff !important;
        }
      }
    }
  }
}
.aqvns-about{
  .auto-box-content{
    padding:0.2rem;
    .content_about{
      line-height: 0.4rem;
    }
  }
}
</style>
