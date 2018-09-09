import { connect } from 'react-redux'
import ExchangeRate from '../components/ExchangeRate'
import { getRateTimerStart, getRateTimerStop } from '../actions/exchangeActions'
import { swapCurrency } from '../actions/currencyActions'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom
  let rates = state.exchange.data && state.exchange.data.rates || {}
  return {
    enableExchangeBtn: exchangeFrom.exchangeAmount > 0,
    exchangeRate: rates[exchangeFrom.currencyName],
    currencyFromName: exchangeFrom.currencyName,
    currencyToName: state.currency.exchangeTo.currencyName
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