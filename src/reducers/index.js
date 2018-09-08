import { combineReducers } from 'redux'
import currency from './CurrencyStore'

const app = combineReducers({
  currency
})
export default app