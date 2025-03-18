import {
  CodeGenerationParam,
  CodeTemplate,
  TableFieldColumn,
} from '@/api/code/types'
import { BaseCodeView } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { useGenCodeParamStore } from '@/store/modules/cache'
import i18n from '@/i18n/index'
const t = i18n.global.t
const useGenCodeParam = useGenCodeParamStore()
/**
 *
 * @param baseCodeView
 * @param tableData
 * @returns
 */
const buildCodeParamsWithCodeView = (
  baseCodeViews: BaseCodeView[],
  tableData: SelectDataTableData
): CodeGenerationParam[] => {
  return baseCodeViews
    ?.filter((v) => v !== undefined && v)
    .map((item) => {
      const p = item.toCodeGenerationParam()
      p.tableName = tableData.table?.tableName
      p.dataBaseName = tableData.table?.dataBaseName
      useGenCodeParam.setCodeParamCache(p.configName, p)
      return p
    })
}
/**
 *
 * @param template
 * @param tableData
 * @returns
 */
const buildCodeParamsWithTemplate = (
  template: CodeTemplate,
  tableData: SelectDataTableData,
  tableFieldColumnList: TableFieldColumn[] = []
): CodeGenerationParam[] => {
  const configs = template.templateConfigList
  const params = []
  for (let config of configs) {
    const p = CodeGenerationParam.mack(
      tableData,
      template,
      config.name,
      tableFieldColumnList
    )
    useGenCodeParam.setCodeParamCache(p.configName, p)
    params.push(p)
  }
  return params
}
/**
 *
 * @param template
 * @param tableData
 * @param tableFieldColumnList
 * @returns
 */
const buildCodeParamsWithCache = (
  template: CodeTemplate,
  tableData: SelectDataTableData,
  responseTemplateCodeList: string[]
): CodeGenerationParam[] => {
  const configs = template.templateConfigList
  const params = []
  for (let config of configs) {
    const p = useGenCodeParam.getCodeParamCache(config.name)
    if (!p) {
      const p = CodeGenerationParam.mack(tableData, template, config.name)
      useGenCodeParam.setCodeParamCache(p.configName, p)
    }
    if (responseTemplateCodeList) {
      p.generationCodeFile = responseTemplateCodeList.includes(p.configName)
    }
    params.push(p)
  }
  return params
}

const initBuildCodePrams = () => {
  return [
    { name: 'Entity', description: t('code.tab-pojo') },
    { name: 'VO', description: t('code.tab-pojo') },
    { name: 'Mapper', description: t('code.tab-mapper') },
    { name: 'Xml', description: t('code.tab-xml') },
    { name: 'ServiceApi', description: t('code.tab-service-api') },
    { name: 'Service', description: t('code.tab-service') },
    { name: 'Controller', description: t('code.tab-controller') },
  ]
}

const initBuildXmlCodeParams = () => {
  return [
    'insertSelective',
    'insertOne',
    'insertList',
    'insertOrUpdateSelective',
    'updateByPrimaryKey',
    'updateByPrimaryKeySelective',
    'selectPage',
    'selectByEntity',
    'selectByPrimaryKey',
    'deleteByPrimaryKey',
  ]
}
const initBuildMapperCodeParams = () => {
  return [
    'insertSelective',
    'insertOne',
    'insertList',
    'insertOrUpdateSelective',
    'updateByPrimaryKey',
    'updateByPrimaryKeySelective',
    'selectPage',
    'selectByEntity',
    'selectByPrimaryKey',
    'deleteByPrimaryKey',
  ]
}

const initBuildControllerCodeParams = () => {
  return ['search', 'page', 'detail', 'save', 'update', 'delete']
}

export function getInitApiCodeParams(type: string): Array<string> {
  if (type == 'Mapper') {
    return initBuildMapperCodeParams()
  }
  if (type == 'Xml') {
    return initBuildXmlCodeParams()
  }
  if (type == 'Controller') {
    return initBuildControllerCodeParams()
  }
  return []
}
export {
  initBuildCodePrams,
  initBuildXmlCodeParams,
  initBuildMapperCodeParams,
  buildCodeParamsWithCodeView,
  buildCodeParamsWithTemplate,
  buildCodeParamsWithCache,
  initBuildControllerCodeParams,
}
