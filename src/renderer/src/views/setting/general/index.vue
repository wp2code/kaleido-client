<script lang="ts" setup>
interface Language {
  label: string
  value: string
}
import { changeLanguage, activeLanguage } from '@/i18n/index'
const languages = ref<Language[]>()
const selectLanguage = ref<Language>()
const changeLang = (v: string) => {
  changeLanguage(v)
}
onMounted(() => {
  languages.value = [
    {
      label: '简体中文',
      value: 'zh',
    } as Language,
    {
      label: '繁体中文（台湾）',
      value: 'zh-tw',
    } as Language,
    {
      label: 'English',
      value: 'en',
    } as Language,
  ]
  const activeLanguageValue = activeLanguage() || 'zh'
  selectLanguage.value = languages.value.filter(
    (obj) => obj.value == activeLanguageValue
  )[0]
})
</script>

<template>
  <div class="language-box">
    <label>{{ $t('language') }}:</label>
    <el-select
      v-model="selectLanguage"
      placeholder="Select"
      style="width: 220px"
      @change="changeLang"
    >
      <el-option
        v-for="item in languages"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span
          style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
        >
          {{ item.value }}
        </span>
      </el-option>
    </el-select>
  </div>
</template>
<style lang="scss" scoped>
.language-box {
  padding: 5rem;
  color: #ddd;
  label {
    margin-right: 1rem;
  }
}
</style>
