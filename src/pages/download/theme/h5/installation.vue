<template>
  <div>
    <div class="page_box">
      <div class="banner"><img id="headerBg" src="/static/download/banner.png"/></div>
      <div class="log-container bottom-line">
        <div class="logo"><img id="headerLog" src="/static/download/logo.png"/></div>
        <div class="text-box">
          <!-- <div id="appName" class="text1">开元棋牌</div> -->
          <!--  <div class="text2"><span id="downloadNum" class="s1">0</span><span class="s2">IOS/Android</span><span
                      id="appVersion" class="s3">v0.00</span></div> -->
        </div>
      </div>
      <div class="text-content bottom-line">
        <div id="contentBox" class="content-box">
          开元棋牌是国内一家综合性游戏平台，提供百家乐，千炮捕鱼，炸金花，牛牛等数百款视讯及电子游戏。
        </div>
      </div>

      <ul id="appSteps" class="appSteps">
        <li>
          <div class="step">1</div>
          <p>安装证书</p>
        </li>
        <li>
          <div class="step">2</div>
          <p>安装游戏</p>
        </li>
      </ul>

      <a id="step1" class="zs-btn">安装证书</a>
      <a id="step2" class="zs-btn" style="display: none">安装游戏</a>

      <div class="service-box">
        <a id="service-link" class="service-link">
          <img src="/static/download/service.svg" class="icon"/>
          在线客服
        </a>
      </div>

      <div class="title">安装引导</div>
      <div class="yd-box">
        <div class="step-part">
          <div class="part-img"><img src="/static/download/installationStep1.png" alt=""></div>
          <div class="part-text">点击快速安装后 选择“允许”</div>
        </div>
        <div class="step-part">
          <div class="part-img"><img src="/static/download/installationStep2.png" alt=""></div>
          <div class="part-text">安装官方描述文件 点击“安装”</div>
        </div>
        <div class="step-part">
          <div class="part-img"><img src="/static/download/installationStep3.png" alt=""></div>
          <div class="part-text">安装开始前需输入解锁密码（无密码忽略此步）</div>
        </div>
        <div class="step-part">
          <div class="part-img"><img src="/static/download/installationStep4.png" alt=""></div>
          <div class="part-text">点击安装进入下一步</div>
        </div>
        <div class="step-part">
          <div class="part-img"><img src="/static/download/installationStep5.png" alt=""></div>
          <div class="part-text">最后再次点击“安装”后即可</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'installation'
}
</script>
<style lang="less" type='text/less' scoped>
  * {
    padding: 0px;
    margin: 0px;
    font-family: 微软雅黑, serif;
    font-size: 0;
    line-height: 1;
    box-sizing: border-box;
  }

  body, html {
    background: #fff;
  }

  .log-container {
    position: relative;
    margin: 0 0.4rem;
  }

  .bottom-line {
    border-bottom: 1px solid rgb(233, 233, 233);
  }

  .clearfix {
    *zoom: 1;
  }

  .zs-btn {
    width: 90%;
    height: 1rem;
    line-height: 1rem;
    margin: 0 auto;
    border-radius: 2.5rem;
    background: rgb(51, 135, 255);
    color: #ffffff;
    font-size: 0.35rem;
    text-align: center;
    display: block;
    text-decoration: none;
  }

  .service-box {
    margin: 0 auto;
    height: 50px;
    text-align: center;
  }

  .service-box a {
    height: 50px;
    line-height: 50px;
    font-size: 0.27rem;
    font-weight: bold;
    display: inline-block;
    color: rgb(89, 151, 233);
  }

  .service-box a .icon {
    width: 0.32rem;
    height: 0.32rem;
    top: 2px;
    position: relative;
    display: inline-block;
    color: rgb(89, 151, 233);
  }

  .appSteps {
    position: relative;
    counter-reset: step;
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
  }

  .appSteps li {
    list-style-type: none;
    font-size: 0.9rem;
    text-align: center;
    width: 50%;
    position: relative;
    float: left;
    color: rgb(164, 164, 164);
  }

  .appSteps li .step {
    display: block;
    width: 32px;
    height: 32px;
    background-color: rgb(233, 239, 245);
    line-height: 32px;
    border-radius: 32px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    font-weight: 700;
    margin: 0 auto 8px auto;
  }

  .appSteps li p {
    font-size: 0.2rem;
  }

  .appSteps li::after {
    content: '';
    width: 60%;
    height: 2px;
    background-color: rgb(233, 239, 245);
    position: absolute;
    left: -30%;
    top: 15px;
    z-index: -1;
  }

  .appSteps li:first-child::after {
    display: none;
  }

  .appSteps.step01 li:nth-of-type(1) .step {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step02 li:nth-of-type(1) .step {
    background-color: rgb(233, 239, 245);
    text-indent: -9999px;
    position: relative;
  }

  .appSteps.step02 li:nth-of-type(2) .step {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step02 li:nth-of-type(2)::after {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step02 li:nth-of-type(1) .step::after {
    content: "";
    position: absolute;
    top: 9px;
    left: 13px;
    width: 5px;
    height: 10px;
    border: 1px solid rgb(51, 135, 255);
    border-top: none;
    border-left: none;
    transform: rotate(40deg);
  }

  .appSteps.step03 li:nth-of-type(1) .step {
    background-color: rgb(233, 239, 245);
    text-indent: -9999px;
    position: relative;
  }

  .appSteps.step03 li:nth-of-type(2) .step {
    background-color: rgb(233, 239, 245);
    text-indent: -9999px;
    position: relative;
  }

  .appSteps.step03 li:nth-of-type(3) .step {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step03 li:nth-of-type(2)::after {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step03 li:nth-of-type(3)::after {
    background-color: rgb(51, 135, 255);
  }

  .appSteps.step03 li:nth-of-type(1) .step::after {
    content: "";
    position: absolute;
    top: 9px;
    left: 13px;
    width: 5px;
    height: 10px;
    border: 1px solid rgb(51, 135, 255);
    border-top: none;
    border-left: none;
    transform: rotate(40deg);
  }

  .appSteps.step03 li:nth-of-type(2) .step::after {
    content: "";
    position: absolute;
    top: 9px;
    left: 13px;
    width: 5px;
    height: 10px;
    border: 1px solid rgb(51, 135, 255);
    border-top: none;
    border-left: none;
    transform: rotate(40deg);
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    line-height: 0;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  table {
    border-collapse: collapse;
  }

  @media screen and (max-width: 320px ) {
    html {
      font-size: 9px;
    }
  }

  @media screen and (min-width: 321px) and (max-width: 375px ) {
    html {
      font-size: 10px;
    }
  }

  @media screen and (min-width: 376px )  and (max-width: 414px ) {
    html {
      font-size: 11px;
    }
  }

  @media screen and (min-width: 415px )  and (max-width: 670px ) {
    html {
      font-size: 12px;
    }
  }

  @media screen and (min-width: 671px ) {
    html {
      font-size: 20px;
    }
  }

  @media only screen and (device-width: 375px) and (-webkit-device-pixel-ratio: 3) {

  }

  .page_box {
    position: relative;
    max-width: 750px;
    width: 100%;
    margin: auto;
  }

  .banner {
    height: 160px;
  }

  .banner img {
    width: 100%;
  }

  .logo {
    width: 20%;
    margin: -5% auto 0.5% 4.5%;
    border-radius: 18px;
    border: 0 solid #fff;
    height: 75px;
  }

  .hong_bao {
    position: absolute;
    top: 11px;
    right: 29px;
    animation: swing 1s linear infinite;
  }

  .hong_bao img {
    width: 70px;
    height: 49px;
  }

  @media (min-width: 320px) and (max-width: 345px) {
    .logo {
      margin: -11% auto -4.5% 0;
    }
  }

  @media (min-width: 346px) and (max-width: 374px) {
    .logo {
      margin: -8% auto -2.5% 0;
    }
  }

  @media (min-width: 375px) and (max-width: 390px) {
    .logo {
      margin: -4% auto 0.5% 0;
    }
  }

  @media (min-width: 391px) and (max-width: 413px) {
    .logo {
      margin: -1% auto 2.5% 0;
    }
  }

  @media (min-width: 414px) and (max-width: 500px) {
    .logo {
      margin: 1% auto 3.5% 0;
    }
  }

  @media (min-width: 501px) and (max-width: 699px) {
    .logo {
      margin: 10% auto 5.5% 0;
    }
  }

  @media (min-width: 700px) and (max-width: 1024px) {
    .logo {
      margin: 19% auto 9.5% 0;
    }

    .hong_bao {
      position: absolute;
      top: 27px;
      right: 138px;
      animation: swing 1s linear infinite;
    }

    .hong_bao img {
      width: 140px;
      height: 93px;
    }
  }

  .logo img {
    width: 100%;
    border-radius: 18px;
  }

  .text-box {
    position: absolute;
    left: 27.5%;
    top: 30%;
  }

  /*
  .text1 {
      color: #282828;
      font-size: 1.7rem;
  }

  .text2 {
      margin-top: 2%;
      white-space: nowrap;
  }

  .text2 span {
      display: inline-block;
      line-height: 1.5;
      color: #9a9a9a;
      font-size: 1rem;
      margin-right: 1.4em;
      padding-left: 1.2em;
  }

  .text2 .s1 {
      background: url("../../../assets/common/img/2.png") no-repeat left;
      background-size: auto 60%;
      width: 19%;
  }

  .text2 .s2 {
      background: url("../../../assets/common/img/3.png") no-repeat left;
      background-size: auto 60%;
  }

  .text2 .s3 {
      background: url("../../../assets/common/img/4.png") no-repeat left;
      background-size: auto 60%;
  }
  */

  .pic-box {
    display: flex;
    width: 87%;
    margin: auto;
  }

  .pic-box div {
    flex: 1
  }

  /*.pic-box div span{display: block; margin: 0 2%; background: #d8d8d8; height: 60px;}*/
  .pic-box div span {
    display: block;
    margin: 0px 2%;
    top: 5px;
    font-size: 13px;
    color: #a7a7a7;
    height: 60px;
  }

  @keyframes myfirst {
    0% {
      left: 0;
      right: 0;
    }
    100% {
      left: -10%;
      right: 100%;
    }
  }

  @keyframes myfirst2 {
    0% {
      left: 50%;
      right: 50%;
    }
    100% {
      left: 3.5em;
      right: 0;
    }
  }

  .step-box {
    background: #fff;
    position: relative;
    padding: 4% 0;
    margin-top: 0%;
  }

  .step-box .list .img-box {
    width: 85%;
    margin: 2% auto;
  }

  .step-box .list .img-box img {
    width: 100%;
  }

  .step-box .list .text {
    text-align: center;
    font-size: 1.2rem;
    color: #3e3e3e;
  }

  .swiper-container {
    height: 150px;
  }

  .swiper-pagination {
    position: relative;
    bottom: 0 !important;
  }

  .swiper-pagination-bullet {
    width: 1.7em;
    height: 1.7em;
    text-align: center;
    line-height: 1.5;
    font-size: 1rem;
    color: #b7b7b7;
    opacity: 1;
    border: 1px solid #cecece;
    background: none;
  }

  .swiper-pagination-bullet-active {
    color: #fff;
    background: #007aff;
    border: 1px solid #007aff;
  }

  .pf-box {
    padding: 1.8rem 1.9rem;
    padding-top: 1.3rem;
  }

  .pf-content {
    width: 100%;
    display: flex;
    justify-content: space-around
  }

  .content-left {
    left: 0;
    position: relative;
  }

  .content-left img {
    width: 45px;
  }

  .content-left p {
    font-size: 1rem;
    font-weight: bold;
    color: #b5b5b5;
  }

  .content-right img {
    width: 24.05rem;
  }

  .text-content {
    padding: 18px 10px;
    min-height: 80px;
    margin: 0 0.4rem;
  }

  .content-box {
    width: 100%;
    font-size: 16px;
    color: #717171;
    font-weight: 500;
    line-height: 1.7;
  }

  .yd-box {
    margin: 0rem 0.2rem;
    background-color: rgb(247, 247, 247);
    border-radius: 0.12rem;
  }

  .title, .step-part {
    width: 100%;
  }

  .step-part .part-img {
    padding: 0.2rem 0.5rem;
  }

  .step-part img {
    width: 100%;
  }

  .title {
    font-size: 0.31rem;
    width: 3rem;
    height: 0.5rem;
    line-height: 0.5rem;
    color: #333333;
    font-weight: bold;
    text-align: left;
    margin-left: 0.35rem;
  }

  .part-text {
    width: 100%;
    height: 2.1rem;
    color: #474747;
    font-size: 1.08rem;
    font-weight: 700;
    text-align: left;
    margin-bottom: 1.5rem;
    margin-top: .5rem;
    padding-left: 1.8rem
  }

  .xz-box {
    border-top: 1px solid #e7e7e7;
    padding: 1rem 1rem 1rem 1rem;
    background: #ffffff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .xz-box .home {
    float: left;
    height: 100%;
    width: 50px;
    color: black;
    text-align: center;
  }

  .xz-box .home p {
    font-size: 10px;
    margin-top: 6px;
  }

  .xz-box .home img {
    height: 22px;
    width: 22px;
  }

  .end {
    padding: 0.8rem 2.9rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .end img {
    width: 45%;
  }

  #grade {
    font-size: 2.5rem;
    color: black;
  }

  @keyframes swing {
    10% {
      transform: rotate(15deg);
    }
    20% {
      transform: rotate(-10deg);
    }
    30% {
      transform: rotate(5deg);
    }
    40% {
      transform: rotate(-5deg);
    }
    50%, 100% {
      transform: rotate(0deg);
    }
  }

</style>
