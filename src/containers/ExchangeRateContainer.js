import { connect } from 'react-redux'
import ExchangeRate from '../components/ExchangeRate'
import { getRateTimerStart, getRateTimerStop } from '../actions/exchangeActions'
import { swapCurrency } from '../actions/currencyActions'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom
  let sourceCurrencyName = exchangeFrom.currencyName
  let data = state.exchange.data || {}
  let matchBase = data.base === sourceCurrencyName
  let rates = matchBase ? data.rates : {}
  let targetCurrencyName = state.currency.exchangeTo.currencyName
  return {
    exchangeRate: rates[targetCurrencyName],
    currencyFromName: sourceCurrencyName,
    currencyToName: targetCurrencyName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getRate: () => {
      dispatch(getRateTimerStart())
    },
    getRateStop: () => {
      dispatch(getRateTimerStop())
    },
    onSwapBtnClicked: () => {
      dispatch(swapCurrency())
    }
  }
}
const ExchangeRateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeRate)

export default ExchangeRateContainer