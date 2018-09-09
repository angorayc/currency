import { getRateTimerRestart } from './exchangeActions'

export const SELECT_FROM_CURRENCY = 'SELECT_FROM_CURRENCY'
export const SELECT_TO_CURRENCY = 'SELECT_TO_CURRENCY'
export const INPUT_FROM_AMOUNT = 'INPUT_FROM_AMOUNT'
export const INPUT_TO_AMOUNT = 'INPUT_TO_AMOUNT'

export const currencyFromSwitched = (currencyCode) => {
  return {
    type: SELECT_FROM_CURRENCY,
    currencyCode: parseInt(currencyCode.currencyCode, 10),
    currencyName: currencyCode.currencyName
  } 
}

export const currencyToSwitched = (currencyCode) => {
  return {
    type: SELECT_TO_CURRENCY,
    currencyCode: parseInt(currencyCode.currencyCode, 10),
    currencyName: currencyCode.currencyName
  } 
}

export const handleFromCurrencyChanged = (currencyCode) => {
  return (dispatch) => {
    // return Promise.resolve(dispatch(currencyFromSwitched(currencyCode)))
    //   .then(() => {
    //     dispatch(getRateTimerRestart())
    //   })
    dispatch(currencyFromSwitched(currencyCode))
    dispatch(getRateTimerRestart())
  }
}

export const handleToCurrencyChanged = (currencyCode) => {
  return (dispatch) => {
    // return Promise.resolve(dispatch(currencyFromSwitched(currencyCode)))
    //   .then(() => {
    //     dispatch(getRateTimerRestart())
    //   })
    dispatch(currencyToSwitched(currencyCode))
    //dispatch(getRateTimerRestart())
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

