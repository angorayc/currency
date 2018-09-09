import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleFromCurrencyChanged, handleFromAmountInput } from '../actions/currencyActions'

const mapStateToProps = state => {
  let exchangeFrom = state.currency.exchangeFrom || {}
  return {
    currencyCode: exchangeFrom.exchageCode,
    currencyName: exchangeFrom.currencyName,
    exchangeType: exchangeFrom.exchangeType,
    exchangeAmount: exchangeFrom.exchangeAmount,
    balance: exchangeFrom.balance
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrencyChange: (value, exchangeType) => {
      dispatch(handleFromCurrencyChanged(value, exchangeType))
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