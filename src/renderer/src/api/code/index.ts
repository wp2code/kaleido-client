import {
  CodeTemplate,
  CodeGenerationResult,
  CodeGenerationParam,
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
  codeGenerationList?: CodeGenerationParam[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: '/api/v1/code-gen/generation',
    method: 'post',
    data: { codeGenerationList, templateId } || {},
  })
}
/**
 *
 * @param queryParams
 * @returns
 */
export function previewCode(
  templateId: string,
  codeGenerationList?: CodeGenerationParam[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: `/api/v1/code-gen/preview`,
    method: 'post',
    data: { codeGenerationList, templateId } || {},
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
