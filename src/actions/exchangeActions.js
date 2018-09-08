export const SELECT_FROM_CURRENCY = 'SELECT_FROM_CURRENCY'
export const SELECT_TO_CURRENCY = 'SELECT_TO_CURRENCY'
export const INPUT_FROM_AMOUNT = 'INPUT_FROM_AMOUNT'
export const INPUT_TO_AMOUNT = 'INPUT_TO_AMOUNT'

export const handleFromCurrencyChanged = (currencyCode) => {
  return {
    type: SELECT_FROM_CURRENCY,
    currencyCode
  }
}

export const handleFromAmountInput = (exchangeAmount) => {
  return {
    type: INPUT_FROM_AMOUNT,
    exchangeAmount
  }
}

export const handleToCurrencyChanged = (currencyCode) => {
  return {
    type: SELECT_TO_CURRENCY,
    currencyCode
  }
}

export const handleToAmountInput = (exchangeAmount) => {
  return {
    type: INPUT_TO_AMOUNT,
    exchangeAmount
  }
}