  <template>
  <view-page full-box  :class="this.type==='lotteryInfo'?'page-box':''">
    <div class="lotter-header" slot="header" :class="type=='lotteryInfo'?'header-color':'header-img'">
          <div class="header-lf">
            <span class="back" @click="$router.push('/home?homeGameType=10000')">
              <img src="../../../assets/img/lottery/amhg/back.png" alt=""/>
            </span>
            <span class="lotteryImg">
              <img src="../../../assets/img/lottery/amhg/lotterHall.png" alt=""/>
            </span>
          </div>
          <div class="header-rt">
            <ul>
              <li 
                v-for="(item,i) in topList" 
                :key="i"
                :class="index===i?'active':''"
                @click="changeTab(item,i)"
                >
                {{item.name}}
                <img class="current" v-show="index===i" src="../../../assets/img/lottery/amhg/current.png" alt="" />
                </li>
            </ul>
          </div>
    </div>

     <div class="home-type" slot="content">
      <!--  彩票推荐    -->
      <div class="hot-list" v-if="type==='recommend'">
        <lottery-list :list="hotList"></lottery-list>
      </div>
        <!-- 彩票分类 -->
      <div class="category-list" v-if="categoryList&&type==='category'">
        <van-tabs
        sticky
        v-model="tabIndex" 
        background="#f6f6f6"
        swipe-threshold="5"
        :border="false" 
        :line-height="0"
        @click="onTabChange">
          <van-tab 
            v-for="(item,i) in categoryList"
            :key="i"
            :name="i"
            :title="item.name">
            <lottery-list :list="item.games"></lottery-list>
          </van-tab>
        </van-tabs>
      </div>
      <!-- 历史记录 -->
      <div class="history" v-if="type==='history'">
        <div v-if="isShow">
          <div class="history-no">
            <img src="../../../assets/img/lottery/amhg/history_no.png" alt="" />
            <span>暂无历史记录</span>
          </div>
          <div class="list">
            <p>
              <img src="../../../assets/img/lottery/amhg/lotter_tj.png" alt="" />
            </p>
            
            <lottery-list :list="historyHotList"></lottery-list>
          </div>
        </div>
        <lottery-list :list="historyList"></lottery-list>
      </div>
      <!-- 我的 -->
      <lottery-info  v-if="type==='lotteryInfo'"></lottery-info>
      <div slot="static">
        <slot></slot>
      </div>
    </div>
  </view-page>
</template>

<script>
import { scroll } from "cube-ui"
import homeMixin from "../../home/theme/mixin";
import HallTime from "./hall-time/timer"
import LotteryList from "./lottery-list/index"
import LotteryInfo from "./lottery-info/index"
export default {
  name: "TypeAMHG",
  mixins: [homeMixin],
  data() {
    return {
      showType:'',
      isShow:false,
      type:'recommend',
      id:'30001|30002',
      index:0,
      tabIndex:0,
      topList:[
        {name:'推荐',type:'recommend',id:'30001|30002'},
        {name:'分类',type:'category',id:30003},
        {name:'历史',type:'history',id:30003},
        {name:'我的',type:'lotteryInfo',id:0}
      ],
      hotList: [],
      historyList:[],
      historyHotList:[],
      historyListId:[],
      categoryList: [],
      scrollHeight: 0,
      headerHeight: 0,
      swipeSportIndex: 0,
      inGameLoging: true,
      result:[],
    };
  },
  components: {
    cubeScroll: scroll,
    HallTime:HallTime,
    LotteryList:LotteryList,
    LotteryInfo:LotteryInfo
  },
  computed: {
    theme() {
      return this.$store.state.main.theme;
    },
  },
  watch: {},
  created() {
    if(this.$route.query.name==='彩票大厅'||this.$route.query.type==='recommend'||this.$route.query.type==='undefined'||this.$route.query.name==='长龙助手'){
      this.index = 0;
      this.type = 'recommend';
      this.getLotteryList(this.id);
      localStorage.removeItem('tabIndex')
    }
    if(this.$route.query.type==='category'&&this.$route.query.name!=='长龙助手'){
      this.index = 1;
      this.type =  'category';
      this.tabIndex = localStorage.getItem('tabIndex')*1
      this.getLotteryList(30003);
    }
    if(this.$route.query.type==='history'){
      this.index = 2;
      this.type = 'history'
      this.getBetHistory();
      localStorage.removeItem('tabIndex')
    }
    if(this.$route.query.type==='lotteryInfo'){
      this.index = 3;
      this.type =  'lotteryInfo';
      localStorage.removeItem('tabIndex')
    }
   },
  
  mounted() {},
  methods: {
    getBetHistory() {
      this.$store.dispatch('lottery/getBetHistory', {
        callback: res => {
            this.isShow = res.length ? false :true;
            this.historyListId = res;
            this.getLotteryList(30003)
        }
      })
    },
    getLotteryList(id){
        this.$store.dispatch('main/getNewGame', {
        id: id,
        callback: res => {
          //彩票推荐
          let longDragon = {
                code : "",
                icon: require("@src/assets/img/home/amhg/longDragon.png"),
                id: 99996,
                name: "长龙助手",
                series: "",
                tag: "",
                title: "推荐星级",
                type: "other",
                upid: 99996,
              }
          if(this.type==='recommend') {
            if(res && res['30002']) {
              this.showType = res['30002']
            }
            if (res && Object.prototype.toString.call(res['30001']) === '[object Array]' && res['30001'].length) {
                this.hotList = []
                if(this.showType === 'B') {
                  res['30001'].forEach(item=>{
                    if(item.name==='热门') {
                      this.hotList = item.games
                      this.hotList.forEach((item) =>{
                      this.$set(item,'icon',this.changeIcon(item.icon))
                      })
                    }
                  })
                }
                if(this.showType === 'A') {
                 let arr = [];
                  res['30001'].forEach(item=>{
                    arr = arr.concat(item.games)
                  })
                  this.hotList = arr.filter(item => item.hot === 1)
                  this.hotList.forEach((item) =>{
                    this.$set(item,'icon',this.changeIcon(item.icon))
                  })
                }
                localStorage.setItem('hotList',JSON.stringify(this.hotList))
                this.hotList.unshift(longDragon)
              }
          }
         
          //彩票分类
          if(this.type==='category'){
            this.categoryList = [];
            if(res && Object.prototype.toString.call(res['30003']) === '[object Array]' && res['30003'].length) {
              this.categoryList = res['30003']
              this.categoryList.forEach((item,index)=>{
                item.games.forEach(t => {
                  this.$set(t,'icon',this.changeIcon(t.icon))
                })
              })
            }
          }
          //彩票历史
          if(this.type==='history' && this.historyListId.length){
            if(res && Object.prototype.toString.call(res['30003']) === '[object Array]' && res['30003'].length) {
             this.historyList = [];
             let list = res['30003']
          
             let historyArr = []
             list.forEach(item=>{
               historyArr = historyArr.concat(item.games);
             })
             //去重
             for(let i=0;i<historyArr.length;i++) {
               for(let j=i+1;j<historyArr.length;j++) {
                 if(historyArr[i].id===historyArr[j].id) {
                   historyArr.splice(j,1)
                   j--
                 }
               }
             }
             this.historyListId.forEach(key=>{
               historyArr.forEach(item=>{
                 if(item.id==key) this.historyList.push(item)
               })
             })
           
             this.historyList.forEach(item=>{
               this.$set(item,'icon',this.changeIcon(item.icon))
             })
            }
          }else{
            this.historyHotList = JSON.parse(localStorage.getItem('hotList'));
          }
        }
      })
    },
    changeIcon(url) {
      let index = url.indexOf('.png');
      let newIcon = url.substring(0,index)+'_a.png';
      return newIcon
    },
    changeTab(item,i) {
      this.index = i;
      this.id = item.id;
      this.type = item.type;
      if(this.type!=='lotteryInfo') {
        if(this.type === 'recommend') {
          let query = {name:'彩票大厅',type:'recommend'}
        this.$router.push({path:'/home/type/10000',query:query})
        }

        if(this.type === 'category') {
          let query = {type:'category'}
        this.$router.push({path:'/home/type/10000',query:query})
        }

        if(this.type === 'history'){
          let query = {type:'history'}
          this.$router.push({path:'/home/type/10000',query:query})
          if (this.$store.state.user.userInfo && this.$store.state.user.token) {
            return;
          }else{
            this.$router.push("/admin/login");
          }
        }
      }
      if(this.type === 'lotteryInfo') {
        let query = {type:'lotteryInfo'}
       this.$router.push({path:'/home/type/10000',query:query})
        }
    },
    onTabChange(index) {
      localStorage.setItem('tabIndex',index)
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../style/icon/home-icon-xpj";
/deep/ .cube-scroll-content {
  display: inline-block;
}
.page-box {
  background:#00B8FF;
}
.lotter-header {
    width:100%;
    height:2rem;
    display:flex;
    justify-content: space-between;
    padding:0.15rem 0.32rem 0 0.24rem;
    .header-lf {
      height:100%;
      display:flex;
      align-items:flex-start;
      .back {
        display:inline-block;
        height:100%;
        padding-top:0.05rem;
        img{
          width:0.52rem;
          height:0.42rem;
          vertical-align:top;
        }
      }
      .lotteryImg {
        display:inline-block;
        height:100%;
        margin-left:0.25rem;
        img {
          width:1.93rem;
          height:0.81rem;
          vertical-align:top;
        }
      }
    }
    .header-rt {
      ul {
        width:3.8rem;
        height:0.78rem;
        display:flex;
        justify-content: space-between;
        align-items:center;
        li {
          font-size:0.36rem;
          color:#fff;
          position: relative;
          .current {
            width:0.29rem;
            height: 0.24rem;
            position: absolute;
            top:0.6rem;
            left:0.16rem;
          }
        }
        .active {
          font-weight: 600;
        }
      }
    }
}
.header-img {
  background:url('../../../assets/img/lottery/amhg/headerBg.png');
  background-size: 100% 100%;
}
.header-color {
  background:#00B8FF;
}
.home-type {
  position: relative;
  width: 100%;
  height: 100%;
  .hot-list {
    width: 100%;
    height: 100%;
    margin: 0;
    background: #f6f6f6;
    
  }
  .category-list {
   /deep/.van-tabs::after{
        display:none;
    }
    /deep/.van-tabs__wrap {
      .van-tabs__nav {
        padding:0;
      }
      .van-tab {
        max-width: 25%;
        flex:none;
        font-size: 0.3rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ccc;
        padding: 0 0.2rem;
      }
     
      .van-tab--active {
        font-size: 0.36rem;
        font-weight: 800;
        color: #3A3F9A!important;
      }
    }
  } 
  .history {
    .history-no {
      margin-top:0.5rem;
      img {
        width:3.21rem;
        height: 2.1rem;
      }
      span {
        display: block;
        font-size: 0.28rem;
        font-weight: 400;
        color: #999999;
        margin-top:0.22rem;
      }
    }
    .list {
      p{
        margin:1rem 0.35rem 0 0;
        img{
          width:3.22rem;
          height: 0.5rem;
        }
      }
    }
  }
}

</style>
