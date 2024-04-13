import { CodeGenerationParam, CodeTemplate } from '@/api/code/types'
import { SelectDataTableData } from '@/api/datasource/types'
/**
 *
 * @param template
 * @param tableData
 * @returns
 */
const buildCodeParams = (
  template: CodeTemplate,
  tableData: SelectDataTableData
): CodeGenerationParam[] => {
  console.log('>>>>>>tableData', tableData)
  const configs = template.templateConfigList
  const params = []
  for (let config of configs) {
    const p = CodeGenerationParam.mack(tableData, template, config.name)
    params.push(p)
  }
  return params
}

export { buildCodeParams }
