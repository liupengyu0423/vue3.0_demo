<template>
  <div class="home">
    <h1>svg组件的引入</h1>
    <div @click="clickBtn">
      <svg-icon icon-class="vip"/>
    </div>
    <div class="btn">
      {{btnTxt}}
    </div>
  </div>
</template>

<script>
import {
  utils
} from '@/libs/interfaces'
export default {
  name: 'home',
  data () {
    return {
      btnTxt: '按钮'
    }
  },
  methods: {
    clickBtn: utils.throttle(function () {
      console.log(this.btnTxt)
      console.log(`now is ${Date.now()}`)
      this.$toast({
        message: 'message'
      })
    }, 1000)
  }
}
</script>
