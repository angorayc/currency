import { connect } from 'react-redux'
import ExchangeSubmitBtn from '../components/ExchangeSubmitBtn'
import { handleExchangeSubmit, handleExchange } from '../actions/exchangeActions'
import configs from '../configs'
import { get as _get } from 'lodash'


const mapStateToProps = state => {
  let currencyCode = _get(state.currency, 'exchangeFrom.currencyCode')
  let targetRate = _get(state.exchange, `data.${currencyCode}.rates`)
  let exchangeAmount = _get(state.currency, 'exchangeFrom.exchangeAmount')
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