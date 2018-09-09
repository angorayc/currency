import { combineReducers } from 'redux'
import * as actions from '../actions/currencyActions'
import configs from '../configs'
const defaultExchangeFrom = 0
const defaultExchangeTo = 1
const initialFrom = {
  currencyCode: defaultExchangeFrom,
  exchangeType: 'from',
  currencyName: configs.currency[defaultExchangeFrom],
  exchangeAmount: '',
  balance: 0
}
const initialTo = {
  currencyCode: defaultExchangeTo,
  exchangeType: 'to',
  currencyName: configs.currency[defaultExchangeTo],
  exchangeAmount: '',
  balance: 0
}
const exchangeFrom = function(state = initialFrom, action) {
  let exchangeAmount = action.exchangeAmount ? parseFloat(action.exchangeAmount, 10) : action.exchangeAmount
  let currencyCode = action.currencyCode
  switch (action.type) {
    case actions.SELECT_FROM_CURRENCY:
      return Object.assign({}, state, {
        currencyCode: currencyCode,
        currencyName: configs.currency[currencyCode]
      })
    case actions.INPUT_FROM_AMOUNT:

      // exchangeAmount = exchangeAmount ? parseFloat(action.exchangeAmount, 10) : action.exchangeAmount

      return Object.assign({}, state, {
        exchangeAmount: exchangeAmount,
        balance: 0
      })
    default:
      return state
  }
}
const exchangeTo = function(state = initialTo, action) {
  let exchangeAmount = action.exchangeAmount ? parseFloat(action.exchangeAmount, 10) : action.exchangeAmount
  let currencyCode = action.currencyCode
  switch (action.type) {
    case actions.SELECT_TO_CURRENCY:
      return Object.assign({}, state, {
        currencyCode: currencyCode,
        currencyName: configs.currency[currencyCode]
      })
    case actions.INPUT_TO_AMOUNT:

      return Object.assign({}, state, {
        exchangeAmount: exchangeAmount,
        balance: 0
      })
    default:
      return state
  }
}

const CurrencyStore = combineReducers({
  exchangeFrom,
  exchangeTo
})
export default CurrencyStore