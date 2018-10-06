import { connect } from 'react-redux'
import ExchangeSubmitBtn from '../components/ExchangeSubmitBtn'
import { handleExchangeSubmit, handleExchange } from '../actions/exchangeActions'
import configs from '../configs'
import { get as _get } from 'lodash'


const mapStateToProps = state => {
  let sourceCurrencyName = _get(state.currency, 'exchangeFrom.currencyName')
  let matchBase = _get(state.exchange, 'data.base') === sourceCurrencyName
  let rates = matchBase ? _get(state.exchange, 'data.rates', {}) : {}
  let targetCurrencyName = _get(state.currency, 'exchangeTo.currencyName')
  let targetRate = _get(rates, targetCurrencyName)
  let exchangeAmount = _get(state.currency, 'exchangeFrom.exchangeAmount')
  let currencyCode = _get(state.currency, 'exchangeFrom.currencyCode')
  let balance = _get(state.currency, `exchangeFrom.balance.${currencyCode}`)
  return {
    enableExchangeBtn: (targetRate
      && (exchangeAmount > configs.exchange.MIN_EXCHANGE_AMOUNT)
      && (exchangeAmount <= balance))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFormSubmit: () => {
      dispatch(handleExchangeSubmit())
    },
    onEachangeSubmit: () => {
      dispatch(handleExchange())
    }
  }
}
const ExchangeSubmitContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeSubmitBtn)

export default ExchangeSubmitContainer