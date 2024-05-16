import {
  CodeTemplate,
  CodeGenerationResult,
  CodeGenerationParam,
  JavaTypeInfo,
} from './types'
import { AxiosPromise } from 'axios'
import request from '../request'
/**
 *
 * @param queryParams
 * @returns
 */
export function listTemplateConfig(
  queryParams?: any
): AxiosPromise<CodeTemplate[]> {
  return request({
    url: '/api/v1/code-tp/list',
    method: 'post',
    data: queryParams || {},
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function generationCode(
  templateId: string,
  connectionId: string,
  codeGenerationList?: CodeGenerationParam[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: '/api/v1/code-gen/generation',
    method: 'post',
    data: { connectionId, templateId, codeGenerationList } || {},
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function previewCode(
  templateId: string,
  connectionId: string,
  codeGenerationList?: CodeGenerationParam[],
  responseTemplateCodeList?: string[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: `/api/v1/code-gen/preview`,
    method: 'post',
    data:
      {
        connectionId,
        templateId,
        codeGenerationList,
        responseTemplateCodeList,
      } || {},
  })
}
/**
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function updateBasicConfigById(
  id: string,
  basicConfig: string
): AxiosPromise<Boolean> {
  return request({
    url: `/api/v1/code-tp/${id}/update`,
    method: 'put',
    data: {
      basicConfig,
    },
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function previewCodeByTemplateId(
  templateId: string,
  codeGenerationParam?: CodeGenerationParam
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: `/api/v1/code-gen/${templateId}/preview`,
    method: 'post',
    data: codeGenerationParam || {},
  })
}

/**
 *
 * @param queryParams
 * @returns
 */
export function getJavaTypeList(
  classification: string = ''
): AxiosPromise<JavaTypeInfo[]> {
  return request({
    url: `/api/v1/code-gen/java/type?cf=${classification}`,
    method: 'get',
  })
}
