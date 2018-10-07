import { connect } from 'react-redux'
import ExchangeRate from '../components/ExchangeRate'
import { getRateTimerStart, getRateTimerStop } from '../actions/exchangeActions'
import { swapCurrency } from '../actions/currencyActions'
import { get as _get } from 'lodash'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom
  let sourceCurrencyName = exchangeFrom.currencyName
  let currencyCode = exchangeFrom.currencyCode
  let data = _get(state.exchange, `data.${currencyCode}`, {})
  let matchBase = data.base === sourceCurrencyName
  let rates = matchBase ? data.rates : {}
  let targetCurrencyName = state.currency.exchangeTo.currencyName
  return {
    exchangeRate: _get(rates, targetCurrencyName, ''),
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