import configs from '../configs'
import { get as _get } from 'lodash'
import { caculateSourceAmount, caculateTargetAmount,
  updateSourceAmount, updateTargetAmount } from './currencyActions'
export const GET_RATE_START = 'GET_RATE_START'
export const GET_RATE_SUCCESS = 'GET_RATE_SUCCESS'
export const GET_RATE_FAILURE = 'GET_RATE_FAILURE'
export const START_RATE_TIMER = 'START_RATE_TIMER'
export const CLEAR_RATE_TIMER = 'CLEAR_RATE_TIMER'
export const EXCHANGE_SUBMIT = 'EXCHANGE_SUBMIT'

const getRateStart = () => {
  return {
    type: GET_RATE_START
  }
}

const getRateSuccess = (data) => {
  return {
    type: GET_RATE_SUCCESS,
    data
  }
}

const getRateFailure = () => {
  return {
    type: GET_RATE_FAILURE
  }
}

let timer


export const getRate = () => {

  return (dispatch, getState) => {
    dispatch(getRateStart())
    let storeState = getState()
    let base = storeState.currency.exchangeFrom.currencyName
    let baseCode = parseInt(storeState.currency.exchangeFrom.currencyCode, 10)
    let symbols = Object.keys(configs.currency).reduce((acc, currCode) => {
    let currName = configs.currency[currCode]

      return (parseInt(currCode, 10) !== baseCode && acc.indexOf(currName) < 0) ? acc.concat([currName]) : acc
    }, []).join(',')
    console.log(`fetching http://data.fixer.io/api/latest?base=${base}&symbols=${symbols}`)

    return fetch(`https://data.fixer.io/api/latest?access_key=4f010a2fe1a7f83edcc3d777077950aa&base=${base}&symbols=${symbols}`)
      .then(
        response => response.json(),
        error => dispatch(getRateFailure())
      )
      .then(data => { dispatch(getRateSuccess(data)) })
      .then(() => {
        let lastestStoreState = getState()
        let exchangeAmount
        let targetAmount
        if (lastestStoreState.currency.isExchangeFromFocused) {
          exchangeAmount = _get(lastestStoreState.currency, 'exchangeFrom.exchangeAmount')
          targetAmount = caculateTargetAmount(lastestStoreState, exchangeAmount)
          dispatch(updateTargetAmount(targetAmount))
        } else {
          exchangeAmount = _get(lastestStoreState.currency, 'exchangeTo.exchangeAmount')
          targetAmount = caculateSourceAmount(lastestStoreState, exchangeAmount)
          dispatch(updateSourceAmount(targetAmount))
        }
      })
    // return Promise.resolve({
    //   "success": true,
    //   "timestamp": 1536479948,
    //   "base": base,
    //   "date": "2018-09-09",
    //   "rates": {
    //       "GBP": 0.895555,
    //       "USD": 1.157152,
    //       "EUR": 1.222222
    //   }
    // }).then((data) => {
    //   dispatch(getRateSuccess(data))
    // }).catch(() => {
    //   dispatch(getRateFailure())
    // })
  }
}

export const getRateTimerStart = () => {
  return (dispatch, getState) => {    
    
    return Promise.resolve(dispatch({ type: START_RATE_TIMER }))
      .then(() => { dispatch(getRate()) })
      .then(() => { timer = setInterval(() => { dispatch(getRate()) }, 1000 * 60 * 60) })
  }
}

export const getRateTimerStop = () => {
  return (dispatch) => {

    return Promise.resolve(dispatch({ type: CLEAR_RATE_TIMER }))
      .then(() => { clearInterval(timer) })
  }
}

export const getRateTimerRestart = () => {
  return (dispatch) => {
    return Promise.resolve(dispatch(getRateTimerStop()))
      .then(() => {
        dispatch(getRateTimerStart())
      })
  }
}

export const handleExchangeSubmit = () => {
  return {
    type: EXCHANGE_SUBMIT
  }
}