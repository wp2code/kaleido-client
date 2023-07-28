<script lang="ts" setup>
import { isExternal } from "@/utils/index";
import { useRouter } from "vue-router";
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});

const router = useRouter();
function push() {
  router.push(props.to).catch((err) => {
    console.error(err);
  });
}
</script>

<template>
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <div v-else @click="push">
    <slot />
  </div>
</template>
