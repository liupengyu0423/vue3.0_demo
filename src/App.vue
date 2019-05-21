<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/help">Help</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './css/base';
#app {
  text-align: center;
}
#nav {
  @include px2rem(padding, 30);
  a {
    font-weight: bold;
    &.router-link-exact-active {
      color: $active_font_color;
    }
  }
}
</style>
