import configs from '../configs'

export const GET_RATE_START = 'GET_RATE_START'
export const GET_RATE_SUCCESS = 'GET_RATE_SUCCESS'
export const GET_RATE_FAILURE = 'GET_RATE_FAILURE'
export const START_RATE_TIMER = 'START_RATE_TIMER'
export const CLEAR_RATE_TIMER = 'CLEAR_RATE_TIMER'

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
      console.log('---2---')

  return (dispatch, getState) => {
    dispatch(getRateStart())
    console.log('---2a---')
    let storeState = getState()
    let base = storeState.currency.exchangeFrom.currencyName
    let baseCode = parseInt(storeState.currency.exchangeFrom.currencyCode, 10)
    let symbols = Object.keys(configs.currency).reduce((acc, currCode) => {
      let currName = configs.currency[currCode]
      console.log('xxx', currCode, baseCode, acc, currName)

      return (parseInt(currCode, 10) !== baseCode && acc.indexOf(currName) < 0) ? acc.concat([currName]) : acc
    }, []).join(',')
    console.log(`fetching http://data.fixer.io/api/latest?base=${base}&symbols=${symbols}`)

    // return fetch('http://data.fixer.io/api/latest?access_key=4f010a2fe1a7f83edcc3d777077950aa&symbols=GBP,EUR,USD')
    //   .then(
    //     response => response.json(),
    //     error => dispatch(getRateFailure())
    //   )
    //   .then(
    //     data => dispatch(getRateSuccess(data))
    //   )
    return Promise.resolve({
      "success": true,
      "timestamp": 1536479948,
      "base": "EUR",
      "date": "2018-09-09",
      "rates": {
          "GBP": 0.895555,
          "USD": 1.157152
      }
    }).then((data) => {
      dispatch(getRateSuccess(data))
    }).catch(() => {
      dispatch(getRateFailure())
    })
  }
}

export const getRateTimerStart = () => {
  return (dispatch, getState) => {    
    
    return Promise.resolve(dispatch({ type: START_RATE_TIMER }))
      .then(() => { dispatch(getRate()) })
      .then(() => { timer = setInterval(() => { dispatch(getRate()) }, 1000 * 10) })
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