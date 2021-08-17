<template>
<view-page class="about theme-header-bg" full-box>
    <title-header title="长龙介绍" slot="header" class="theme-header-bg theme-header-bottom"></title-header>
    <div class="wrapper_about theme-header-bg" slot="content">
        <div class="banner"></div>
        <section class="tent theme-main-bg-5">
            <!-- <div class="title">玩法简介</div> -->
            <p style="margin-bottom: 0.3rem" class="theme-color-white">长龙助手是对快3、时时彩、PK10、六合彩特定玩法的“大小单双” 开奖结果进行跟踪统计，并可进行快捷投注的助手工具。</p>
            <p style="margin-bottom: 0.4rem;" class="theme-color-white">每期出现大、小、单、双的概率为50%，如果连续3期及以上的开奖结果相同，称之为“长龙”，通常会采用倍投的方式进行“斩龙”或“顺龙”。</p>
            <div class="title theme-color-yellow-2" style="color:#F63C18;margin-bottom: 0.1rem;text-align:left;"><i class="tip"></i>什么叫斩龙</div>
            <p style="padding-left: 0.35rem" class="theme-color-white">如连续开5期“单”，可以选择“双”进行投注，这种投注方案称之为“斩龙”；</p>
            <div class="title theme-color-yellow-2" style="color:#F63C18;margin-bottom: 0.1rem;text-align:left;"><i class="tip"></i>什么叫顺龙</div>
            <p style="padding-left: 0.35rem" class="theme-color-white">如连续开5期“单”，继续选择“单”进行投注，这种投注方案称之为“顺龙”</p>
            <div class="title theme-color-yellow-2" style="color:#F63C18;margin-bottom: 0.1rem;text-align:left;"><i class="tip"></i>什么叫倍投</div>
            <p style="padding-left: 0.35rem;margin-bottom: 0.4rem;" class="theme-color-white">倍投是一种翻倍投注方式，是为了保障能够在“斩龙”或“顺龙”的过程中持续盈利的一种投注方式。</p>
        </section>
    </div>
</view-page>
</template>

<script>
export default {
    name: 'lotteryRules',

}
</script>

<style lang="less" scoped>
.wrapper_about{
    overflow: hidden;
}
.banner {
    width: 7.1rem;
    height: 1.9rem;
    background-image: url('../../../assets/img/lottery/clzs/banner.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    margin: 0.2rem auto;
}

.tent {
    margin: 0.25rem 0.2rem;
    height: auto;
    font-size: 0.32rem;
    background-color: #ffffff;
    padding: 0.42rem 0.24rem;
    border-radius: 0.25rem;
    box-shadow: 4px 6px 13px rgba(0, 0, 0, 0.32);
    letter-spacing: 0.01rem;

    // font-weight: bold;
    .title {
        display: flex;
        align-items: center;
        margin-bottom: 0.24rem;
    }

    >p {
        text-align: left;
        color: #333333;
        margin-bottom: 0.24rem;
    }

    .tip {
        height: .32rem;
        width: 0.32rem;
        margin-right: 0.18rem;
        display: inline-block;
        background-image: url('../../../assets/img/lottery/clzs/rules.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        box-sizing: border-box;
    }
}
</style>
