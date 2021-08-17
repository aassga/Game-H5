const HomeXpj = () => import(/* webpackChunkName: "home-xpj" */ './xpj/Index').then(m => m.default)
const HomeTctx = () => import(/* webpackChunkName: "home-tctx" */ './tctx/index').then(m => m.default)
const HomeVns = () => import(/* webpackChunkName: "home-vns" */ './vns/Index').then(m => m.default)
const HomeQP = () => import(/* webpackChunkName: "home" */ './qp/index').then(m => m.default)
const HomeAmhg = () => import(/* webpackChunkName: "home" */ './amhg/index').then(m => m.default)
const HomeBlush = () => import(/* webpackChunkName: "home-blush" */ './blush/index').then(m => m.default)
const HomeCpxpj = () => import(/* webpackChunkName: "home-blush" */ './cpxpj/index').then(m => m.default)
const HomeAqvns = () => import(/* webpackChunkName: "home-blush" */ './aqvns/index').then(m => m.default)
// const HomeJs85 = () => import(/* webpackChunkName: "home-blush" */ './js85/index').then(m => m.default)
export {
  HomeXpj,
  HomeVns,
  HomeTctx,
  HomeQP,
  HomeAmhg,
  HomeBlush,
  HomeCpxpj,
  HomeAqvns,
  // HomeJs85,
}
