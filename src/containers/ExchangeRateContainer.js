import { connect } from 'react-redux'
import ExchangeRate from '../components/ExchangeRate'
import { getRateTimerStart, getRateTimerStop } from '../actions/exchangeActions'

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
    }
  }
}
const ExchangeRateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeRate)

export default ExchangeRateContainer