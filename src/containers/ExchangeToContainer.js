import { connect } from 'react-redux'
import Currency from '../components/Currency'
import { handleToCurrencyChanged, handleToAmountInput } from '../actions/exchangeActions'

const mapStateToProps = state => {
  let exchangeTo = state.currency.exchangeTo || {}
  return {
    currencyCode: exchangeTo.currencyCode,
    currencyName: exchangeTo.currencyName,
    exchangeType: exchangeTo.exchageType,
    exchangeAmount: exchangeTo.exchangeAmount,
    balance: exchangeTo.balance
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCurrencyChange: (currencyCode) => {
      dispatch(handleToCurrencyChanged(currencyCode))
    },
    onAmountChange: (value) => {
      dispatch(handleToAmountInput(value))
    }
  }
}
const ExchangeFromContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Currency)

export default ExchangeFromContainer