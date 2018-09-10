import { getRateTimerRestart } from './exchangeActions'
import configs from '../configs'
import { get as _get } from 'lodash'
import numeral from 'numeral'

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

export const swapCurrency = () => {
  return (dispatch, getState) => {
    
    let storeState = getState()
    let exchangeFrom = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeTo = _get(storeState.currency, 'exchangeTo.currencyCode')

    let sourceAmount = storeState.currency.isExchangeFromFocused ? 'exchangeFrom' : 'exchangeTo'
    let baseAmount = _get(storeState.currency, `${sourceAmount}.exchangeAmount`)

    return Promise.resolve(dispatch(handleFromCurrencyChanged(exchangeTo)))
      .then(() => dispatch(handleToCurrencyChanged(exchangeFrom)))
      .then(() => {
        if (storeState.currency.isExchangeFromFocused)
          dispatch(updateTargetAmount(baseAmount))
        else
          dispatch(updateSourceAmount(baseAmount))
      })
      .then(() => dispatch({ type: SWAP_CURRENCY }))

  }
}

export const handleFromCurrencyChanged = (currencyCode) => {
  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeFrom = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeTo = _get(storeState.currency, 'exchangeTo.currencyCode')

    return Promise.resolve(dispatch(currencyFromSwitched(currencyCode)))
      .then(() => {
        if (parseInt(currencyCode, 10) === parseInt(exchangeTo, 10))
          return dispatch(currencyToSwitched(exchangeFrom))
      })
      .then(() => {
        dispatch(getRateTimerRestart())
      })
    
  }
}

export const handleToCurrencyChanged = (currencyCode) => {
  return (dispatch, getState) => {

    let storeState = getState()
    let exchangeFrom = storeState.currency.exchangeFrom.currencyCode
    let exchangeTo = storeState.currency.exchangeTo.currencyCode

    return Promise.resolve(dispatch(currencyToSwitched(currencyCode)))
      .then(() => {
        if (parseInt(currencyCode, 10) === parseInt(exchangeFrom, 10))
          dispatch(currencyFromSwitched(exchangeTo))
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

const getTargetRate = (storeState) => {
  let sourceCurrencyName = _get(storeState.currency, 'exchangeFrom.currencyName')
  let matchBase = _get(storeState.exchange, 'data.base') === sourceCurrencyName
  let rates = matchBase ? _get(storeState.exchange, 'data.rates', {}) : {}
  let targetCurrencyName = _get(storeState.currency, 'exchangeTo.currencyName')
  let targetRate = _get(rates, targetCurrencyName)
  return targetRate
}

export const caculateTargetAmount = (storeState, exchangeAmount) => {

  let targetRate = getTargetRate(storeState)
  let expectAmount = targetRate ? ((exchangeAmount || 0) * targetRate) : ''
  expectAmount = expectAmount > 0 ? numeral(expectAmount).format('0.00') : ''

  return expectAmount
}

export const caculateSourceAmount = (storeState, exchangeAmount) => {
  
  let targetRate = getTargetRate(storeState)
  let expectAmount = targetRate ? ((exchangeAmount || 0) / targetRate) : ''
  expectAmount = parseFloat(expectAmount, 10) > 0 ? numeral(expectAmount).format('0.00') : '' 

  return expectAmount
}



export const handleFromAmountInput = (exchangeAmount) => {

  return (dispatch, getState) => {

    return new Promise((resolve, reject) => {
      if (getTargetRate(getState()))
        resolve(dispatch(updateSourceAmount(exchangeAmount)))
      else {
        setTimeout(() => {
          dispatch(handleFromAmountInput(exchangeAmount))
        }, 1000 * 0.5)
      }
    })
    .then(() => {
      let expectAmount = caculateTargetAmount(getState(), exchangeAmount)
      dispatch(updateTargetAmount(expectAmount))
    })
  }
}

export const handleToAmountInput = (exchangeAmount) => {
  
  return (dispatch, getState) => {

    return new Promise((resolve, reject) => {
      if (getTargetRate(getState()))
        resolve(dispatch(updateTargetAmount(exchangeAmount)))
      else {
        setTimeout(() => {
          dispatch(handleToAmountInput(exchangeAmount))
        }, 1000 * 0.5)
      }
    })
    .then(() => {
      let expectAmount = caculateSourceAmount(getState(), exchangeAmount)
      dispatch(updateSourceAmount(expectAmount))
    })
  }
}

