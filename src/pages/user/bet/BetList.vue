<template>
<component :is="'pub-'+type" :type="type" :date="date"></component>
</template>

<script type="text/javascript">
import { BetLottery, BetLive, BetSlot, BetChess, BetSport } from '../../../pages'

export default {
  name: 'BetList',
  components: {
    'pub-lottery': BetLottery,
    'pub-live': BetLive,
    'pub-slot': BetSlot,
    'pub-chess': BetChess,
    'pub-sport': BetSport
  },
  props: {
    type: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
}
</script>
