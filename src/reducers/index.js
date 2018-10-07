import { combineReducers } from 'redux'
import currency from './CurrencyStore'
import exchange from './ExchangeStore'

const app = combineReducers({
  currency,
  exchange
})
export default app