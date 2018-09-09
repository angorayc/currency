import { connect } from 'react-redux'
import ExchangeSubmitBtn from '../components/ExchangeSubmitBtn'
import { handleExchangeSubmit } from '../actions/exchangeActions'
import { swapCurrency } from '../actions/currencyActions'

const mapStateToProps = state => {
  return {}
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