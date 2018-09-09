import { connect } from 'react-redux'
import ExchangeSubmitBtn from '../components/ExchangeSubmitBtn'
import { handleExchangeSubmit } from '../actions/exchangeActions'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom
  let sourceCurrencyName = exchangeFrom.currencyName
  let data = state.exchange.data || {}
  let matchBase = data.base === sourceCurrencyName
  let rates = matchBase ? data.rates : {}
  let targetCurrencyName = state.currency.exchangeTo.currencyName
  return {
    enableExchangeBtn: rates[targetCurrencyName] ? true : false
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFormSubmit: () => {
      dispatch(handleExchangeSubmit())
    }
  }
}
const ExchangeSubmitContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeSubmitBtn)

export default ExchangeSubmitContainer