import {
  CodeGenerationParam,
  CodeTemplate,
  TableFieldColumn,
} from '@/api/code/types'
import { BaseCodeView } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
import { useGenCodeParamStore } from '@/store/modules/cache'
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
    { name: 'Entity', description: '模型层（Entity）' },
    { name: 'VO', description: '模型层（VO）' },
    { name: 'Mapper', description: '数据持久层（Mapper）' },
    { name: 'Xml', description: '数据持久层（XML）' },
    { name: 'ServiceApi', description: '业务层（ServiceApi）' },
    { name: 'Service', description: '业务层（ServiceImpl）' },
    { name: 'Controller', description: '接口层（Controller）' },
  ]
}

const initBuildXmlCodeParams = () => {
  return [
    'insertSelective',
    'insertOrUpdate',
    'insertOrUpdateSelective',
    'updateByPrimaryKey',
    'updateByPrimaryKeySelective',
    'selectByEntity',
    'selectByPrimaryKey',
    'deleteByPrimaryKey',
  ]
}
const initBuildMapperCodeParams = () => {
  return [
    'insertSelective',
    'insertOrUpdate',
    'insertOrUpdateSelective',
    'updateByPrimaryKey',
    'updateByPrimaryKeySelective',
    'selectByEntity',
    'selectByPrimaryKey',
    'deleteByPrimaryKey',
  ]
}
export {
  initBuildCodePrams,
  initBuildXmlCodeParams,
  initBuildMapperCodeParams,
  buildCodeParamsWithCodeView,
  buildCodeParamsWithTemplate,
  buildCodeParamsWithCache,
}
