import * as actions from '../actions/exchangeActions'

const exchangeRate = function(state = { data: null, error: null }, action) {
  switch (action.type) {
    case actions.GET_RATE_START:
      return {
        data: null,
        error: null
      }
    case actions.GET_RATE_SUCCESS:
    {
      let fixed = (action.data || []).map((base) => {

        Object.keys(base.rates || {}).forEach((currencyCode) => {
          base.rates[currencyCode] = Number.parseFloat(base.rates[currencyCode]).toFixed(4)
        })
        return base
      })
      
      return {
        data: fixed || [],
        error: null
      }
    }
    case actions.GET_RATE_FAILURE:
      return {
        data: null,
        error: action.error
      }
    default:
      return state
  }
}
export default exchangeRate