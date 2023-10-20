<template>
  <div class="htmlClass" v-html="html"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
const props = defineProps({
  url: String,
})
onMounted(() => {
  load(props.url)
})
const html = ref('')
// let config = {
//   headers: {
//     'Content-Type': 'text/html',
//     'Access-Control-Allow-Origin': '*',
//   },
// }
function load(url) {
  if (url && url.length > 0) {
    // 加载中
    let param = {
      accept: 'text/html, text/plain',
      withCredentials: false,
      // headers: {
      //   'Content-Type': 'application/octet-stream',
      //   'Access-Control-Allow-Origin': '*',
      // },
    }
    axios
      .get(url, param)
      .then((response) => {
        // 处理HTML显示
        html.value = response.data
      })
      .catch((err) => {
        console.error('error', err)
        html.value = '加载失败'
      })
  }
}
</script>
<style scoped>
.htmlClass {
  overflow-y: scroll;
  height: 100vh;
}
div::-webkit-scrollbar {
  display: none;
}
</style>
