import * as actions from '../actions/exchangeActions'

const feeRate = function(state = { data: null, error: null }, action) {
  switch (action.type) {
    case actions.GET_FEE_RATE_START:
      return {
        data: null,
        error: null
      }
    case actions.GET_FEE_RATE_SUCCESS:
    {
      let rates = action.data.rates || {}
      let fixed = {}
      Object.keys(rates).forEach((currencyCode) => {
        fixed[currencyCode] = Number.parseFloat(rates[currencyCode]).toFixed(4)
      })
      action.data.rates = fixed
      return {
        data: action.data || {},
        error: null
      }
    }
    case actions.GET_FEE_RATE_FAILURE:
      return {
        data: null,
        error: action.error
      }
    default:
      return state
  }
}
export default feeRate