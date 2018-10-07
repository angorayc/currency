import { caculateFeeRate, caculationError, sendGetRatesRequest } from './exchangeActions'
import configs from '../configs'
import { get as _get } from 'lodash'
import numeral from 'numeral'
import fx from 'money'

export const SELECT_FROM_CURRENCY = 'SELECT_FROM_CURRENCY'
export const SELECT_TO_CURRENCY = 'SELECT_TO_CURRENCY'
export const INPUT_FROM_AMOUNT = 'INPUT_FROM_AMOUNT'
export const INPUT_TO_AMOUNT = 'INPUT_TO_AMOUNT'
export const FOCUS_FROM_AMOUNT = 'FOCUS_FROM_AMOUNT'
export const FOCUS_TO_AMOUNT = 'FOCUS_TO_AMOUNT'
export const SWAP_CURRENCY = 'SWAP_CURRENCY'

export const currencyFromSwitched = (currencyCode) => {
  return {
    type: SELECT_FROM_CURRENCY,
    currencyCode: parseInt(currencyCode, 10),
    currencyName: configs.currency[currencyCode]
  } 
}

export const currencyToSwitched = (currencyCode) => {
  return {
    type: SELECT_TO_CURRENCY,
    currencyCode: parseInt(currencyCode, 10),
    currencyName: configs.currency[currencyCode]
  } 
}

export const swapCurrency = (isFocusChanged = true) => {
  return (dispatch, getState) => {
    
    let storeState = getState()
    let exchangeFrom = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeTo = _get(storeState.currency, 'exchangeTo.currencyCode')
    let isExchangeFromFocusedBeforeSwap = storeState.currency.isExchangeFromFocused
    let sourceAmount = isExchangeFromFocusedBeforeSwap ? 'exchangeFrom' : 'exchangeTo'
    let baseAmount = _get(storeState.currency, `${sourceAmount}.exchangeAmount`)

    return Promise.resolve(dispatch(handleFromCurrencyChanged(exchangeTo)))
      .then(() => dispatch(handleToCurrencyChanged(exchangeFrom)))
      .then(() => {
        return isExchangeFromFocusedBeforeSwap ? dispatch(updateTargetAmount(baseAmount)) :
          dispatch(updateSourceAmount(baseAmount))
      })
      .then(() => isFocusChanged ? dispatch({ type: SWAP_CURRENCY }) : '')
      .then(() => {
        return isExchangeFromFocusedBeforeSwap ? dispatch(caculateSourceAmount(baseAmount)) :
          dispatch(caculateTargetAmount(baseAmount))
      })
      

  }
}

export const handleFromCurrencyChanged = (currencyCode) => {
  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeFrom = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeTo = _get(storeState.currency, 'exchangeTo.currencyCode')

    let exchangeFromAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let exchangeToAmount = _get(storeState.currency, 'exchangeTo.exchangeAmount')

    let isSwap = parseInt(currencyCode, 10) === parseInt(exchangeTo, 10)
    let isExchangeFromFocused = storeState.currency.isExchangeFromFocused

    return Promise.resolve(dispatch(currencyFromSwitched(currencyCode)))
      .then(() => {
        if (isSwap)
          return dispatch(currencyToSwitched(exchangeFrom))
      })
      .then(() => {
          return isExchangeFromFocused ? dispatch(handleFromAmountInput(exchangeFromAmount)) : 
            dispatch(handleToAmountInput(exchangeToAmount))        
      })
  }
}

export const handleToCurrencyChanged = (currencyCode) => {
  return (dispatch, getState) => {

    let storeState = getState()
    let exchangeFrom = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeTo = _get(storeState.currency, 'exchangeTo.currencyCode')

    let exchangeFromAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let exchangeToAmount = _get(storeState.currency, 'exchangeTo.exchangeAmount')

    let isSwap = parseInt(currencyCode, 10) === parseInt(exchangeFrom, 10)
    let isExchangeFromFocused = storeState.currency.isExchangeFromFocused

    return Promise.resolve(dispatch(currencyToSwitched(currencyCode)))
      .then(() => {
        if (isSwap)
          return dispatch(currencyFromSwitched(exchangeTo))
      })
      .then(() => {
          return isExchangeFromFocused ? dispatch(handleFromAmountInput(exchangeFromAmount)) : 
            dispatch(handleToAmountInput(exchangeToAmount))        
      })
  }
}

export const updateSourceAmount = (exchangeAmount) => {
  return { type: INPUT_FROM_AMOUNT, exchangeAmount }
}

export const updateTargetAmount = (exchangeAmount) => {
  return { type: INPUT_TO_AMOUNT, exchangeAmount }
}

export const handleFromAmountFocus = () => {
  return { type: FOCUS_FROM_AMOUNT }
}

export const handleToAmountFocus = () => {
  return { type: FOCUS_TO_AMOUNT }
}

export const caculateTargetAmount = () => {
  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let fromCurrencyCode = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let rates = _get(storeState.exchange, `data.${fromCurrencyCode}.rates`)
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')
    let toCurrencyFee = _get(storeState.currency, 'exchangeTo.fee')

    return Promise.resolve(dispatch(caculateFeeRate()))
      .then(() => { 
        fx.rates = Object.assign({}, rates)
      })
      .then(() => {
        if (exchangeAmount > 0){
          return fx(numeral(exchangeAmount).value()).from(fromCurrency).to(toCurrency)
        } else {
          return exchangeAmount
        }
      })
      .then((expectAmount) => {
        let numeralAmount = numeral(expectAmount || 0)
        numeralAmount.difference(numeral(toCurrencyFee || 0).value())
        let updateValue = numeralAmount.value() ? numeralAmount.format('0.00') : expectAmount
        return dispatch(updateTargetAmount(updateValue))
      })
      .catch((e) => dispatch(caculationError(e)))
  }
}


export const caculateSourceAmount = () => {
  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeAmount = _get(storeState.currency, 'exchangeTo.exchangeAmount')
    let fromCurrencyCode = _get(storeState.currency, 'exchangeTo.currencyCode')
    let rates = _get(storeState.exchange, `data.${fromCurrencyCode}.rates`)
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')
    let fromCurrencyFee = _get(storeState.currency, 'exchangeFrom.fee')
    return Promise.resolve(dispatch(caculateFeeRate()))
      .then(() => { 
        return fx.rates = Object.assign({}, rates)
      })
      .then(() => {
        return exchangeAmount ? fx(numeral(exchangeAmount || 0).value()).from(toCurrency).to(fromCurrency) : exchangeAmount
      })
      .then((expectAmount) => {
        let numeralAmount = numeral(expectAmount || 0)
        numeralAmount.add(numeral(fromCurrencyFee || 0).value())
        let updateValue = numeralAmount.value() ? numeralAmount.format('0.00') : expectAmount
        return dispatch(updateSourceAmount(updateValue))        
      })
      .catch((e) => dispatch(caculationError(e)))
  }
}



export const handleFromAmountInput = (exchangeAmount) => {

  return (dispatch) => {

    return Promise.resolve(dispatch(updateSourceAmount(exchangeAmount)))
      .then(() => dispatch(caculateTargetAmount()))

  }
}

export const handleToAmountInput = (exchangeAmount) => {
  
  return (dispatch) => {

    return Promise.resolve(dispatch(updateTargetAmount(exchangeAmount)))
      .then(() => dispatch(caculateSourceAmount()))
  }
}

