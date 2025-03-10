<script lang="ts" setup></script>

<template>
  <div class="hp-box">
    <div class="hp-title">{{ $t('help-open-dev') }}</div>
    <div class="hp-box-item">
      <div class="devBorder">Window</div>
      <div class="desc devBorder">Control+Shift+I</div>
    </div>
    <div class="hp-box-item">
      <div class="devBorder">Mac</div>
      <div class="desc devBorder">Command+Shift+I</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hp-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ddd;
  .hp-title {
    margin: 10px;
  }
  .hp-box-item {
    display: flex;
    flex-direction: row;
    width: 400px;
  }
  .desc {
    font-size: large;
    font-weight: 600;
    width: 90%;
  }
}
.devBorder {
  width: 20%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-bottom: 0.1px solid #ddd;
}
</style>
