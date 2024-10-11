<script lang="ts" setup>
const time = ref(1)
onMounted(() => {
  setInterval(() => {
    time.value++
  }, 1000)
})
</script>

<template>
  <div class="loading-box">
    <div class="lds-spinner">
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
    </div>
    <div id="timer" class="timer">服务启动中({{ time }})...</div>
  </div>
</template>

<style lang="scss" scoped>
.loading-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  // background-color: var(--subMenuBg);
}
.lds-spinner {
  margin: 0 auto;
  display: inline-block;
  width: 80px;
  height: 80px;
}

.lds-spinner .spinner {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner .spinner:after {
  content: ' ';
  display: block;
  position: absolute;
  top: -3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 30%;
  background: #2196f3;
}

.lds-spinner .spinner:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}

.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}

.lds-spinner .spinner:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}

.lds-spinner .spinner:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}

.lds-spinner .spinner:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}

.lds-spinner .spinner:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}

.lds-spinner .spinner:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}

.lds-spinner .spinner:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}

.lds-spinner .spinner:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}

.lds-spinner .spinner:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}

.lds-spinner .spinner:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}

.lds-spinner .spinner:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}

@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.timer {
  color: #2196f3;
  font-size: medium;
  font-weight: 600;
  top: 24px;
  left: 24px;
  text-align: center;
  line-height: 35px;
}
</style>
