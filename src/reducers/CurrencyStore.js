import { combineReducers } from 'redux'
import { SELECT_FROM_CURRENCY, SELECT_TO_CURRENCY, INPUT_FROM_AMOUNT, INPUT_TO_AMOUNT } from '../actions/exchangeActions'
import configs from '../configs'
const defaultExchangeFrom = 0
const defaultExchangeTo = 1
const initialFrom = {
  currencyCode: defaultExchangeFrom,
  exchangeType: 'from',
  currencyName: configs.currency[defaultExchangeFrom],
  exchangeAmount: 0,
  balance: 0
}
const initialTo = {
  currencyCode: defaultExchangeTo,
  exchangeType: 'to',
  currencyName: configs.currency[defaultExchangeTo],
  exchangeAmount: 0,
  balance: 0
}
const exchangeFrom = function (state = initialFrom, action) {
      console.log('----', state)

  switch (action.type) {
    case SELECT_FROM_CURRENCY:
      return Object.assign({}, state, {
        currencyCode: state.currencyCode,
        currencyName: configs.currency[state.currencyCode]
      })
    case INPUT_FROM_AMOUNT:
      return Object.assign({}, state, {
        exchangeAmount: parseInt(action.exchangeAmount, 10),
        balance: parseInt(state.balance, 10) + parseInt(action.exchangeAmount, 10)
      })
    default:
      return state
  }
}
const exchangeTo = function (state = initialTo, action) {
  switch (action.type) {
    case SELECT_TO_CURRENCY:
      return Object.assign({}, state, {
        currencyCode: state.currencyCode,
        currencyName: configs.currency[state.currencyCode]
      })
    case INPUT_TO_AMOUNT:
      return Object.assign({}, state, {
        exchangeAmount: parseInt(action.exchangeAmount, 10),
        balance: parseInt(state.balance, 10) + parseInt(action.exchangeAmount, 10)
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