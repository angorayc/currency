import configs from '../configs'
import { caculateSourceAmount, caculateTargetAmount } from './currencyActions'
import fx from 'money'
import { get as _get } from 'lodash'
import numeral from 'numeral'

export const GET_RATE_START = 'GET_RATE_START'
export const GET_RATE_SUCCESS = 'GET_RATE_SUCCESS'
export const GET_RATE_FAILURE = 'GET_RATE_FAILURE'
export const START_RATE_TIMER = 'START_RATE_TIMER'
export const CLEAR_RATE_TIMER = 'CLEAR_RATE_TIMER'
export const EXCHANGE_SUBMIT = 'EXCHANGE_SUBMIT'
export const SHOW_TO_FEE = 'SHOW_TO_FEE'
export const SHOW_FROM_FEE = 'SHOW_FROM_FEE'

let timer

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

const showToFee = (fee) => {
  return {
    type: SHOW_TO_FEE,
    fee
  }
}

const showFromFee = (fee) => {
  return {
    type: SHOW_FROM_FEE,
    fee
  }
}

export const getRate = () => {

  return (dispatch, getState) => {
    dispatch(getRateStart())
    let storeState = getState()
    let base = storeState.currency.exchangeFrom.currencyName
    let symbols = getSymbols()

    return sendGetRateRequest(base, symbols)
      .then((resp) => resp.json(), error => dispatch(getRateFailure(error.message)))
      .then((data) => dispatch(getRateSuccess(data)))
      .then(() => {
        let lastestStoreState = getState()
        if (lastestStoreState.currency.isExchangeFromFocused) {
          return dispatch(caculateTargetAmount(lastestStoreState))          
        } else {
          return dispatch(caculateSourceAmount(lastestStoreState))
        }
      })
  }
}

const getSymbols = () => {
  return Object.keys(configs.currency).reduce((acc, currCode) => {
    let currName = configs.currency[currCode]
    return acc +=  currCode > 0 ? `,${currName}` : currName
  }, '')
}


export const getFeeRate = () => {
  let symbols = getSymbols()
  let feeBase = configs.currency[configs.exchange.EXCHANGE_BASE_CODE]

  return (dispatch, getState) => {
    let storeState = getState()
    let exchangeAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')

    dispatch({ type: 'GET_FEE_RATE' })

    return sendGetRateRequest(fromCurrency, symbols)
      .then((resp) => resp.json(), error => dispatch(getRateFailure(error.message)))
      .then((data) => fx.rates = data.rates )
      .then(() => fx(exchangeAmount).from(fromCurrency).to(feeBase))
      .then((expectAmount) => {
        let chargable = expectAmount - configs.exchange.FREE_EXCHANGE_LIMIT
        let feeInBase = chargable * configs.exchange.EXCHANGE_FEE_PERCENTAGE
        let isExchangeFromFocused = storeState.currency.isExchangeFromFocused

        return new Promise((resolve) => {
          let rates = _get(getState().exchange, 'data.rates')          
          resolve(fx.rates = Object.assign({}, rates))
        })
          .then(() => {
            let target = isExchangeFromFocused ? toCurrency : fromCurrency
            if (feeInBase > 0)
              return fx(feeInBase).from(feeBase).to(target)
            else
              return 0
          })
          .then((fee) => {
            return fee > 0 ? numeral(fee).format('0.00') : ''
          })
          .then((feeToShow) => {
            let event = isExchangeFromFocused ? showToFee : showFromFee
            return dispatch(event(feeToShow))
          })
      })
      .catch(e => {
      })
  }
}

export const sendGetRateRequest = (base, symbols) => {
  return fetch(`${configs.exchange.API_HOST}${configs.exchange.GET_LATEST_RATE}`
      + `?access_key=${configs.exchange.APP_ID}`
      + `&base=${base}`
      + `&symbols=${symbols}`)
}

export const getRateTimerStart = () => {
  return (dispatch, getState) => {    
    
    return Promise.resolve(dispatch({ type: START_RATE_TIMER }))
      .then(() => { dispatch(getRate()) })
      .then(() => { timer = setInterval(() => { dispatch(getRate()) }, 1000 * configs.exchange.UPDATE_RATE_FREQUENCY) })
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