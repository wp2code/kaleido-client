import {
  CodeTemplate,
  CodeGenerationResult,
  CodeGenerationParam,
  JavaTypeInfo,
  CodeTemplateBasicConfig,
  PartitionTempate,
  TableFieldColumn,
} from './types'
import request from '../request'
import { TableFieldColumnParam } from '../datasource/types'
import { AxiosPromise } from 'axios'
/**
 *
 * @param queryParams
 * @returns
 */
export function listTemplateConfig(
  queryParams?: any
): AxiosPromise<CodeTemplate[]> {
  return request({
    url: '/v1/code-tp/list',
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
  codeGenerationList?: CodeGenerationParam[],
  responseTemplateCodeList?: string[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: '/v1/code-gen/generation',
    method: 'post',
    data: {
      connectionId,
      templateId,
      codeGenerationList,
      responseTemplateCodeList,
    },
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
  directUseTemplateConfig: boolean,
  codeGenerationList?: CodeGenerationParam[],
  responseTemplateCodeList?: string[]
): AxiosPromise<CodeGenerationResult> {
  return request({
    url: `/v1/code-gen/preview`,
    method: 'post',
    data: {
      connectionId,
      templateId,
      codeGenerationList,
      responseTemplateCodeList,
      directUseTemplateConfig,
    },
  })
}
/**
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function updateGlobalConfig(
  basicConfig: CodeTemplateBasicConfig
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/code-tp/updateGlobalConfig`,
    method: 'put',
    data: basicConfig || {},
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
    url: `/v1/code-gen/${templateId}/preview`,
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
    url: `/v1/code-gen/java/type?cf=${classification}`,
    method: 'get',
  })
}
/**
 *
 * @param templateId
 * @param nameList
 * @returns
 */
export function getTemplateInfo(
  templateId: string,
  nameList?: String[]
): AxiosPromise<CodeTemplate> {
  return request({
    url: `/v1/code-tp/template/info`,
    method: 'post',
    data: {
      templateId,
      nameList,
    },
  })
}
/**
 *
 * @param templateId
 * @param templateName
 * @returns
 */
export function copyAddTemplate(templateId: string, templateName: string) {
  return request({
    url: `/v1/code-tp/add/copy`,
    method: 'post',
    data: {
      templateId,
      templateName,
    },
  })
}
/**
 *
 * @param templateName
 * @param templateId
 * @returns
 */
export function checkTemplateNameExists(
  templateName: string,
  templateId?: string
) {
  return request({
    url: `/v1/code-tp/templateName/exists`,
    method: 'post',
    data: {
      templateId,
      templateName,
    },
  })
}

/**
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function updateTemplateName(
  templateId: string,
  templateName: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/code-tp/templateName/update`,
    method: 'put',
    data: { templateName, templateId },
  })
}

/**
 * 设备默认模板
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function updateDefaultTemplate(
  templateId: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/code-tp/default/${templateId}/update`,
    method: 'put',
  })
}
/**
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function deleteCodeGenerationTemplate(
  templateId: string
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/code-tp/${templateId}/delete`,
    method: 'delete',
  })
}

/**
 *
 * @param id
 * @param basicConfig
 * @returns
 */
export function updateCodeGenerationTemplateOfPartition(
  param: PartitionTempate
): AxiosPromise<Boolean> {
  return request({
    url: `/v1/code-tp/partition/update`,
    method: 'put',
    data: { ...param },
  })
}

/**
 * 获取连接的数据源
 *
 * @param connectionId
 * @returns
 */
export function getTemplateTableFieldColumnList(
  templateId: string,
  codeType: string,
  param: TableFieldColumnParam
): AxiosPromise<TableFieldColumn[]> {
  return request({
    url: `/v1/code-tp/${templateId}/${codeType}/table/column/fields`,
    method: 'post',
    data: { ...param },
  })
}
/**
 * 获取连接的数据源
 *
 * @param connectionId
 * @returns
 */
export function getDefaultGenerateTemplateConfigList(
  templateId: string
): AxiosPromise<TableFieldColumn[]> {
  return request({
    url: `/v1/code-tp/${templateId}/generate/default/list`,
    method: 'get',
  })
}
/**
 * 导出模板
 *
 * @param templateId
 * @returns
 */
export function exportTemplate(templateId: string): AxiosPromise {
  return request({
    url: `/v1/code-tp/file/export?templateId=${templateId}`,
    method: 'get',
    responseType: 'stream',
    headers: { 'Content-Type': 'application/json; application/octet-stream' },
  })
}
/**
 * 导入模板
 *
 * @param templatePath
 * @returns
 */
export function uploadTemplate(data: any): AxiosPromise<String> {
  return request({
    url: `/v1/code-tp/file/upload`,
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 保存导入模板
 *
 * @param templatePath
 * @returns
 */
export function saveUploadTemplate(data: any): AxiosPromise<String> {
  return request({
    url: `/v1/code-tp/file/upload/save`,
    method: 'post',
    data: data,
  })
}
