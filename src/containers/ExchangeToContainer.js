import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleToCurrencyChanged, handleToAmountInput, handleToAmountFocus } from '../actions/currencyActions'
import { get as _get } from 'lodash'

const mapStateToProps = state => {
  let exchangeTo = _get(state.currency, 'exchangeTo', {})
  let exchangeBaseName = _get(state.exchange, 'data.base')
  let exchangeFrom = _get(state.currency, 'exchangeTo', {})
  let currencyCode = exchangeTo.currencyCode

  return {
    currencyCode: currencyCode,
    currencyName: exchangeTo.currencyName,
    exchangeType: exchangeTo.exchangeType,
    exchangeAmount: exchangeTo.exchangeAmount,
    balance: exchangeTo.balance[currencyCode],
    enableAmountInput: exchangeBaseName === exchangeFrom.currencyName,
    isActive: !state.currency.isExchangeFromFocused,
    fee: exchangeTo.fee
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrencyChange: (currencyCode) => {
      dispatch(handleToCurrencyChanged(currencyCode))
    },
    onAmountChange: (value) => {
      dispatch(handleToAmountInput(value))
    },
    onAmountFocus: () => {
      dispatch(handleToAmountFocus())
    }
  }
}
const ExchangeToContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency)

export default ExchangeToContainer