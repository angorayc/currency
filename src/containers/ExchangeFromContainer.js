import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleFromCurrencyChanged, handleFromAmountInput } from '../actions/currencyActions'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom || {}
  return {
    currencyCode: exchangeFrom.currencyCode,
    currencyName: exchangeFrom.currencyName,
    exchangeType: exchangeFrom.exchangeType,
    exchangeAmount: exchangeFrom.exchangeAmount,
    balance: exchangeFrom.balance
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