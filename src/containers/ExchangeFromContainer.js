import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleFromCurrencyChanged, handleFromAmountInput } from '../actions/currencyActions'
import { get as _get } from 'lodash'

const mapStateToProps = state => {
  let exchangeFrom = _get(state.currency, 'exchangeFrom', {})
  let exchangeBaseName = _get(state.exchange, 'data.base')
  return {
    currencyCode: exchangeFrom.currencyCode,
    currencyName: exchangeFrom.currencyName,
    exchangeType: exchangeFrom.exchangeType,
    exchangeAmount: exchangeFrom.exchangeAmount,
    balance: exchangeFrom.balance,
    enableAmountInput: exchangeBaseName === exchangeFrom.currencyName,
    isActive: state.currency.isExchangeFromFocused
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrencyChange: (currencyCode) => {
      dispatch(handleFromCurrencyChanged(currencyCode))
    },
    onAmountChange: (value) => {
      dispatch(handleFromAmountInput(value))
    }
  }
}
const ExchangeFromContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency)

export default ExchangeFromContainer