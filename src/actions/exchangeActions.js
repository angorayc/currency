import configs from '../configs'
import { caculateSourceAmount,
  caculateTargetAmount,
  updateSourceAmount,
  updateTargetAmount
} from './currencyActions'
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
    let symbols = Object.keys(configs.currency).reduce((acc, currCode) => {
      let currName = configs.currency[currCode]
      return acc +=  currCode > 0 ? `,${currName}` : currName
    }, '')

    return fetch(`https://data.fixer.io/api/latest?access_key=4f010a2fe1a7f83edcc3d777077950aa&base=${base}&symbols=${symbols}`)
      .then((resp) => resp.json(), error => dispatch(getRateFailure()))
      .then((data) => {
        dispatch(getRateSuccess(data))
      })
      .then(() => {
        let lastestStoreState = getState()
        if (lastestStoreState.currency.isExchangeFromFocused) {
          return caculateTargetAmount(lastestStoreState)
            .then((expectAmount) => dispatch(updateTargetAmount(expectAmount)))
          
        } else {
          return caculateSourceAmount(lastestStoreState)
            .then((expectAmount) => dispatch(updateSourceAmount(expectAmount)))
        }
      })
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