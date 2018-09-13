import configs from '../configs'
// import { caculateSourceAmount, caculateTargetAmount } from './currencyActions'
import fx from 'money'
import { get as _get } from 'lodash'
import numeral from 'numeral'

export const GET_RATE_START = 'GET_RATE_START'
export const GET_RATE_SUCCESS = 'GET_RATE_SUCCESS'
export const GET_RATE_FAILURE = 'GET_RATE_FAILURE'

export const GET_FEE_RATE_START = 'GET_FEE_RATE_START'
export const GET_FEE_RATE_SUCCESS = 'GET_FEE_RATE_SUCCESS'
export const GET_FEE_RATE_FAILURE = 'GET_FEE_RATE_FAILURE'

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

const getRateFailure = (error) => {
  return {
    type: GET_RATE_FAILURE,
    error
  }
}

const getFeeRateStart = () => {
  return {
    type: GET_FEE_RATE_START
  }
}

const getFeeRateSuccess = (data) => {
  return {
    type: GET_FEE_RATE_SUCCESS,
    data
  }
}

const getFeeRateFailure = (error) => {
  return {
    type: GET_FEE_RATE_FAILURE,
    error
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

const getRate = () => {

  return (dispatch, getState) => {
    dispatch(getRateStart())
    let storeState = getState()
    let base = storeState.currency.exchangeFrom.currencyName
    let symbols = getSymbols()

    return sendGetRateRequest(base, symbols)
      .then((resp) => resp.json(), error => dispatch(getRateFailure(error.message)))
      .then((data) => dispatch(getRateSuccess(data)))
      // .then(() => {
      //   let lastestStoreState = getState()
      //   if (lastestStoreState.currency.isExchangeFromFocused) {
      //     return dispatch(caculateTargetAmount(lastestStoreState))          
      //   } else {
      //     return dispatch(caculateSourceAmount(lastestStoreState))
      //   }
      // })
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
  // let feeBase = configs.currency[configs.exchange.EXCHANGE_BASE_CODE]

  return (dispatch, getState) => {
    let storeState = getState()
    // let exchangeAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    // let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')

    dispatch(getFeeRateStart())

    return sendGetRateRequest(fromCurrency, symbols)
      .then((resp) => resp.json(), error => dispatch(getFeeRateFailure(_get(error, 'message', error))))
      .then((data) => dispatch(getFeeRateSuccess(data)))
      .catch(e => { dispatch(getFeeRateFailure(_get(e, 'message', e))) })
  }
}

export const caculateFeeRate = () => {

  return (dispatch, getState) => {
    let feeBase = configs.currency[configs.exchange.EXCHANGE_BASE_CODE]
    let storeState = getState()
    let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    let exchangeAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let rates = _get(storeState, 'exchange.data.rates', {})
    let feeRates = _get(storeState, 'fee.data.rates', {})
    let isExchangeFromFocused = storeState.currency.isExchangeFromFocused

    return Promise.resolve(fx.rates = Object.assign({}, rates))
    .then(() => {
      console.log('----a-1----', exchangeAmount, fromCurrency, feeBase)
      if (exchangeAmount > 0)
        return fx(exchangeAmount).from(fromCurrency).to(feeBase)
      else
        return 0
    })
    .then((expectAmount) => {
      console.log('----a-2----', exchangeAmount, fromCurrency, feeBase)

      fx.rates = Object.assign({}, feeRates)
      return expectAmount
    }, (e) => { console.log('----c1---', e, rates, exchangeAmount, fromCurrency, feeBase)})
    .then((expectAmount) => {
      let target = isExchangeFromFocused ? toCurrency : fromCurrency
      let chargable = expectAmount - configs.exchange.FREE_EXCHANGE_LIMIT
      let feeInBase = chargable * configs.exchange.EXCHANGE_FEE_PERCENTAGE
      console.log('----a-3----', feeInBase, feeBase, target)

      if (feeInBase > 0)
        return fx(feeInBase).from(feeBase).to(target)
      else
        return 0
    }, (e) => { console.log('----c2---', e)})
    .then((fee) => {
      return fee > 0 ? numeral(fee).format('0.00') : ''
    })
    .then((feeToShow) => {
      let isExchangeFromFocused = storeState.currency.isExchangeFromFocused
      let event = isExchangeFromFocused ? showToFee : showFromFee
      return dispatch(event(feeToShow))
    })
    .catch((e) => { console.log('----c3---', e) })
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
    
    dispatch({ type: START_RATE_TIMER })
    return Promise.resolve(dispatch(getRates()))
      .then(() => {
        timer = setInterval(() => {
          dispatch(getRates())
        }, 1000 * configs.exchange.UPDATE_RATE_FREQUENCY)
      })
  }
}

const getRates = () => {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(getFeeRate()),
      dispatch(getRate())
    ])
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