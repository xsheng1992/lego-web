<template>
  <a-layout class="main-layout">
    <a-layout-header class="header">
      <div class="page-title">
        <router-link to="/">网页乐高</router-link>
      </div>
    </a-layout-header>
    <a-layout-content class="home-content">
      <div class="content-container">
        <router-view />
      </div>
    </a-layout-content>
    <a-layout-footer> footer </a-layout-footer>
  </a-layout>
</template>

<style lang="stylus" scoped>
.main-layout
  .page-title
    color #fff
</style>