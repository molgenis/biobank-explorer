/* istanbul ignore file */
import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { isCodeRegex } from '../../src/store/helpers'

export const genericFilterOptions = (tableName) => {
  return () => new Promise((resolve) => {
    api.get(`/api/v2/${tableName}`).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } })
      resolve(filterOptions)
    })
  })
}

/** Specific logic for diagnosis available filter */
const createDiagnosisLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=like=', arguments: query })
const createDiagnosisCodeQuery = (query) => transformToRSQL({ selector: 'code', comparison: '=like=', arguments: query.toUpperCase() })
/** */

export const diagnosisAvailableFilterOptions = (tableName) => {
  // destructure the query part from the multi-filter
  return ({ query, queryType }) => new Promise((resolve) => {
    let url = `/api/v2/${tableName}`

    if (query) {
      // initial load, values are code
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(`code=in=(${query})`)}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisCodeQuery(query))}&sort=code`
      } else {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisLabelQuery(query))}`
      }
    }

    api.get(url).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.code} ] - ${obj.label || obj.name}`, value: obj.code } })
      resolve(filterOptions)
    })
  })
}

export const collaborationTypeFilterOptions = () => {
  return () => new Promise((resolve) => {
    resolve([{ text: 'Commercial use', value: 'true' }, { text: 'Non-commercial use', value: 'false' }])
  })
}

export const commonNetworkFilterOptions = () => {
  return () => new Promise((resolve) => {
    resolve([
      { text: 'Common SOPs', value: 'common_sops' },
      { text: 'Common Collection Focus', value: 'common_collection_focus' },
      { text: 'Common Charter', value: 'common_charter' },
      { text: 'Common Data Access Policy', value: 'common_data_access_policy' },
      { text: 'Common Sample Access Policy', value: 'common_sample_access_policy' },
      { text: 'Common MTA', value: 'common_mta' },
      { text: 'Common Image Access Policy', value: 'common_image_access_policy' },
      { text: 'Common Image MTA', value: 'common_image_mta' },
      { text: 'Common URL', value: 'common_url' }
    ])
  })
}
