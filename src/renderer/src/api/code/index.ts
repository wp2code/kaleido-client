import { CodeTemplate } from './types'
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
