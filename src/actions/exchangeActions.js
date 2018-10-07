import configs from '../configs'
import { handleFromAmountInput, handleToAmountInput } from './currencyActions'
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

export const CAL_FEE_RATE_ERROR = 'CAL_FEE_RATE_ERROR'
export const HANDLE_SUBMIT_EXCHANGE = 'HANDLE_SUBMIT_EXCHANGE'

let timer


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

export const caculationError = (error) => {
  return {
    type: CAL_FEE_RATE_ERROR,
    error
  }
}

const getSymbols = () => {
  return Object.keys(configs.currency).reduce((acc, currCode) => {
    let currName = configs.currency[currCode]
    return acc +=  currCode > 0 ? `,${currName}` : currName
  }, '')
}


export const caculateFeeRate = () => {

  return (dispatch, getState) => {
    let feeBase = configs.currency[configs.exchange.EXCHANGE_BASE_CODE]
    let storeState = getState()
    let toCurrency = _get(storeState.currency, 'exchangeTo.currencyName')
    let fromCurrency = _get(storeState.currency, 'exchangeFrom.currencyName')
    let fromCurrencyCode = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let exchangeAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let rates = _get(storeState, `exchange.data.${fromCurrencyCode}.rates`, {})
    let feeRates = _get(storeState, `exchange.data.${configs.exchange.EXCHANGE_BASE_CODE}.rates`, {})
    let isExchangeFromFocused = storeState.currency.isExchangeFromFocused
    return Promise.resolve(fx.rates = Object.assign({}, rates))
    .then(() => {
      if (exchangeAmount > 0)
        return fx(exchangeAmount).from(fromCurrency).to(feeBase)
      else
        return 0
    })
    .then((expectAmount) => {

      fx.rates = Object.assign({}, feeRates)
      return expectAmount
    })
    .then((expectAmount) => {
      let target = isExchangeFromFocused ? toCurrency : fromCurrency
      let chargable = expectAmount - configs.exchange.FREE_EXCHANGE_LIMIT
      let feeInBase = chargable * configs.exchange.EXCHANGE_FEE_PERCENTAGE
      if (feeInBase > 0)
        return fx(feeInBase).from(feeBase).to(target)
      else
        return 0
    })
    .then((fee) => {

      return fee > 0 ? numeral(fee).format('0.00') : ''
    })
    .then((feeToShow) => {
      let isExchangeFromFocused = storeState.currency.isExchangeFromFocused
      let event = isExchangeFromFocused ? showToFee : showFromFee
      return dispatch(event(feeToShow))
    })
    .catch((e) => dispatch(caculationError(e)))
  }
}

export const sendGetRateRequest = (base, symbols) => {
  return fetch(`${configs.exchange.API_HOST}${configs.exchange.GET_LATEST_RATE}`
      + `?access_key=${configs.exchange.APP_ID}`
      + `&base=${base}`
      + `&symbols=${symbols}`)
      .then((resp) => resp.json())
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

export const sendGetRatesRequest = () => {

  return (dispatch, getState) => {
    let storeState = getState()
    let symbols = getSymbols()

    return Promise.all([
      sendGetRateRequest('GBP', symbols),
      sendGetRateRequest('EUR', symbols),
      sendGetRateRequest('USD', symbols)
    ])
      .then((data) => {
        dispatch(getRateSuccess(data))
      })
      .catch((error) => {
        dispatch(getRateFailure(error))
      })
      
  }
}

export const getRates = () => {
  return (dispatch, getState) => {
    return Promise.resolve(dispatch(sendGetRatesRequest()))
    .then(() => {
      let storeState = getState()
      let isExchangeFromFocused = storeState.currency.isExchangeFromFocused
      let exchangeFrom = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
      let exchangeTo = _get(storeState.currency, 'exchangeTo.exchangeAmount')

      if (isExchangeFromFocused)
        return dispatch(handleFromAmountInput(exchangeFrom))
      else
        return dispatch(handleToAmountInput(exchangeTo))
    })
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

export const handleExchange = () => {
  return (dispatch, getState) => {
    let storeState = getState()
    let fromCurrencyCode = _get(storeState.currency, 'exchangeFrom.currencyCode')
    let fromCurrencyAmount = _get(storeState.currency, 'exchangeFrom.exchangeAmount')
    let toCurrencyCode = _get(storeState.currency, 'exchangeTo.currencyCode')
    let toCurrencyAmount = _get(storeState.currency, 'exchangeTo.exchangeAmount')
    let exchangeInfo = {
      fromCurrencyCode,
      fromCurrencyAmount,
      toCurrencyCode,
      toCurrencyAmount
    }
    return dispatch(exchange(exchangeInfo))
  }
}

const exchange = (exchangeInfo) => {
  return {
    type: HANDLE_SUBMIT_EXCHANGE,
    fromCurrencyCode: exchangeInfo.fromCurrencyCode,
    fromCurrencyAmount: exchangeInfo.fromCurrencyAmount,
    toCurrencyCode: exchangeInfo.toCurrencyCode,
    toCurrencyAmount: exchangeInfo.toCurrencyAmount
  }
}