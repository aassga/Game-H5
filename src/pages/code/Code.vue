<template>
<component :is="comp"></component>
</template>

<script type="text/javascript">
import Code4000 from './code-4000'
import Code5000 from './code-5000'

export default {
  name: 'Code',
  components: {
    Code4000,
    Code5000
  },
  props: {
    code: {
      required: true
    }
  },
  computed: {
    comp () {
      return 'Code' + this.code
    }
  }
}
</script>
