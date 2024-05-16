import { defineStore } from 'pinia'
import { CodeGenerationParam } from '@/api/code/types'
export const useGenCodeParamStore = defineStore('cache', () => {
  const params = ref<Map<String, CodeGenerationParam>>(
    new Map<String, CodeGenerationParam>()
  )
  function setCodeParamCache(key: string, param: CodeGenerationParam) {
    params.value.set(key, param)
  }
  function getCodeParamCache(key: string): CodeGenerationParam {
    return params.value.get(key)
  }
  const clearCodeParamCache = () => {
    params.value.clear()
  }
  return { setCodeParamCache, getCodeParamCache, clearCodeParamCache }
})
