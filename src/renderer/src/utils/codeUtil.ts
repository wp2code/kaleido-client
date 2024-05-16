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

export { buildCodeParamsWithCodeView, buildCodeParamsWithTemplate }
