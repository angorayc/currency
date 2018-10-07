import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleFromCurrencyChanged, handleFromAmountInput, handleFromAmountFocus } from '../actions/currencyActions'
import { get as _get } from 'lodash'

const mapStateToProps = state => {
  let exchangeFrom = _get(state.currency, 'exchangeFrom', {})
  let currencyCode = exchangeFrom.currencyCode

  let exchangeBase = _get(state.exchange, `data.${currencyCode}.base`, {})
  return {
    currencyCode: currencyCode,
    currencyName: exchangeFrom.currencyName,
    exchangeType: exchangeFrom.exchangeType,
    exchangeAmount: exchangeFrom.exchangeAmount,
    balance: exchangeFrom.balance[currencyCode],
    enableAmountInput: exchangeBase === exchangeFrom.currencyName,
    isActive: state.currency.isExchangeFromFocused,
    fee: exchangeFrom.fee
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrencyChange: (currencyCode) => {
      dispatch(handleFromCurrencyChanged(currencyCode))
    },
    onAmountChange: (value) => {
      dispatch(handleFromAmountInput(value))
    },
    onAmountFocus: () => {
      dispatch(handleFromAmountFocus())
    }
  }
}
const ExchangeFromContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency)

export default ExchangeFromContainer