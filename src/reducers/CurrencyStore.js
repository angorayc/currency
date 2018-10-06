import { combineReducers } from 'redux'
import * as actions from '../actions/currencyActions'
import { SHOW_TO_FEE, SHOW_FROM_FEE, CAL_FEE_RATE_ERROR, HANDLE_SUBMIT_EXCHANGE } from '../actions/exchangeActions'
import configs from '../configs'
const defaultExchangeFrom = configs.exchange.EXCHANGE_BASE_CODE
const defaultExchangeTo = 1
const initialBalance = [100, 50, 0]
const initialFrom = {
  currencyCode: defaultExchangeFrom,
  exchangeType: 'from',
  currencyName: configs.currency[defaultExchangeFrom],
  exchangeAmount: '',
  balance: initialBalance,
  fee: ''
}
const initialTo = {
  currencyCode: defaultExchangeTo,
  exchangeType: 'to',
  currencyName: configs.currency[defaultExchangeTo],
  exchangeAmount: '',
  balance: initialBalance,
  fee: ''
}
const exchangeFrom = function(state = initialFrom, action) {
  let exchangeAmount = action.exchangeAmount ? parseFloat(action.exchangeAmount, 10) : action.exchangeAmount
  let currencyCode = action.currencyCode
  switch (action.type) {
    case actions.SELECT_FROM_CURRENCY:

      return Object.assign({}, state, {
        currencyCode: currencyCode,
        currencyName: configs.currency[currencyCode],
      })
    case actions.INPUT_FROM_AMOUNT:

      return Object.assign({}, state, {
        exchangeAmount: exchangeAmount
      })
    case SHOW_FROM_FEE:
      return Object.assign({}, state, {
        fee: action.fee
      })
    case actions.SWAP_CURRENCY:
      return Object.assign({}, state, {
        fee: ''
      })
    case HANDLE_SUBMIT_EXCHANGE:
    {
      let fromCurrencyCode = action.fromCurrencyCode
      let fromCurrencyAmount = action.fromCurrencyAmount
      let newBalance = state.balance
      newBalance[fromCurrencyCode] -= fromCurrencyAmount
      return Object.assign({}, state, {
        exchangeAmount: '',
        fee: '',
        balance: newBalance
      })
    }
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
        exchangeAmount: exchangeAmount
      })
    case SHOW_TO_FEE:
      return Object.assign({}, state, {
        fee: action.fee
      })
    case actions.SWAP_CURRENCY:
      return Object.assign({}, state, {
        fee: ''
      })
      case HANDLE_SUBMIT_EXCHANGE:
      {
        let toCurrencyCode = action.toCurrencyCode
        let toCurrencyAmount = action.toCurrencyAmount
        let newBalance = state.balance
        newBalance[toCurrencyCode] += toCurrencyAmount
        return Object.assign({}, state, {
          exchangeAmount: '',
          fee: '',
          balance: newBalance
        })
      }
    default:
      return state
  }
}

const isExchangeFromFocused = function(state = true, action) {
  switch (action.type) {
    case actions.SWAP_CURRENCY:
      return !state
    case actions.FOCUS_FROM_AMOUNT:
      return true
    case actions.FOCUS_TO_AMOUNT:
      return false
    default:
      return state
  }
}

const message = function(state = '', action) {
  switch (action.type) {
    case CAL_FEE_RATE_ERROR:
      return action.error
    default:
      return state
  }
}

const CurrencyStore = combineReducers({
  exchangeFrom,
  exchangeTo,
  isExchangeFromFocused,
  message
})
export default CurrencyStore