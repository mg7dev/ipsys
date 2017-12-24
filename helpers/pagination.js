import queryString from 'query-string'

export default (url, params) => {
  const pagination = {
    ...params,
    take:
      (params.itemsPerPage === -1 ? 1000 * 1000 * 1000 : params.itemsPerPage) ||
      10,
    page: params.page || 1,
  }

  return url + '?' + queryString.stringify(pagination)
}
