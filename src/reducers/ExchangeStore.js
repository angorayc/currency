import * as actions from '../actions/exchangeActions'

const exchangeRate = function(state = { data: null, error: null }, action) {
  switch (action.type) {
    case actions.GET_RATE_START:
      return {
        data: null,
        error: null
      }
    case actions.GET_RATE_SUCCESS:
      return {
        data: action.data || {},
        error: null
      }
    case actions.GET_RATE_FAILURE:
      return {
        data: null,
        error: 'Technical Error'
      }
    default:
      return state
  }
}
export default exchangeRate