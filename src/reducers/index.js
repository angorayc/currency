import { combineReducers } from 'redux'
import currency from './CurrencyStore'
import exchange from './ExchangeStore'
import fee from './FeeStore'

const app = combineReducers({
  currency,
  exchange,
  fee
})
export default app