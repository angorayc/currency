import { getRateTimerRestart } from './exchangeActions'
import configs from '../configs'

export const SELECT_FROM_CURRENCY = 'SELECT_FROM_CURRENCY'
export const SELECT_TO_CURRENCY = 'SELECT_TO_CURRENCY'
export const INPUT_FROM_AMOUNT = 'INPUT_FROM_AMOUNT'
export const INPUT_TO_AMOUNT = 'INPUT_TO_AMOUNT'
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
    //dispatch({ type: SWAP_CURRENCY })
    let storeState = getState()
    let exchangeFrom = storeState.currency.exchangeFrom.currencyCode
    let exchangeTo = storeState.currency.exchangeTo.currencyCode
    return Promise.all([
      dispatch(handleFromCurrencyChanged(exchangeTo)),
      dispatch(handleToCurrencyChanged(exchangeFrom))
    ])
  }
}

export const handleFromCurrencyChanged = (currencyCode) => {
  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeFrom = storeState.currency.exchangeFrom.currencyCode
    let exchangeTo = storeState.currency.exchangeTo.currencyCode

    return Promise.resolve(dispatch(currencyFromSwitched(currencyCode)))
      .then(() => {
        if (parseInt(currencyCode, 10) === parseInt(exchangeTo, 10))
          dispatch(currencyToSwitched(exchangeFrom))
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

export const handleFromAmountInput = (exchangeAmount) => {
  return {
    type: INPUT_FROM_AMOUNT,
    exchangeAmount
  }
}

export const handleToAmountInput = (exchangeAmount) => {
  return {
    type: INPUT_TO_AMOUNT,
    exchangeAmount
  }
}

