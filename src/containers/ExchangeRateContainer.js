import { connect } from 'react-redux'
import ExchangeRate from '../components/ExchangeRate'
import { getRateTimerStart, getRateTimerStop } from '../actions/exchangeActions'
import { swapCurrency } from '../actions/currencyActions'

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    getRate: () => {
      dispatch(getRateTimerStart())
    },
    getRateStop: () => {
      dispatch(getRateTimerStop())
    },
    onSwapBtnClicked: () => {
      dispatch(swapCurrency())
    }
  }
}
const ExchangeRateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeRate)

export default ExchangeRateContainer