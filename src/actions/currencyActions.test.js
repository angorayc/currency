let currencyActions = require('./currencyActions')



describe('currencyActions', () => {

  describe('non-async actions', () => {

    describe('currencyFromSwitched', () => {

      test('should trigger correct action', () => {
        const newCode = 1
        const expectedAction = {
            type: currencyActions.SELECT_FROM_CURRENCY,
            currencyCode: newCode,
            currencyName: global.mockConfigs.currency[newCode]
        }
        expect(currencyActions.currencyFromSwitched(newCode)).toEqual(expectedAction)
      })

    })

    describe('currencyToSwitched', () => {

      test('should trigger correct action', () => {
        const newCode = 1
        const expectedAction = {
            type: currencyActions.SELECT_TO_CURRENCY,
            currencyCode: newCode,
            currencyName: global.mockConfigs.currency[newCode]
        }
        expect(currencyActions.currencyToSwitched(newCode)).toEqual(expectedAction)
      })
    })

  })

  describe('async actions', () => {
    let store
    let expectedActions

    describe('swapCurrency', () => {

      // let mockHandleFromCurrencyChanged
      // let mockHandleToCurrencyChanged

      beforeAll(() => {
        jest.spyOn(currencyActions, 'handleFromCurrencyChanged').mockReturnValue({type:global.HANDLE_FROM_CURRENCY_CHANGED})
        jest.spyOn(currencyActions, 'handleToCurrencyChanged').mockReturnValue(global.HANDLE_FROM_CURRENCY_CHANGED)
        jest.spyOn(currencyActions, 'caculateSourceAmount').mockReturnValue(global.CACULATE_SOURCE_AMOUNT)
      })

      test('should handle base selector switched - trigger handleFromCurrencyChanged', () => {
        expectedActions = [
          {
            type: global.HANDLE_FROM_CURRENCY_CHANGED
          },
          {
            type: global.HANDLE_FROM_CURRENCY_CHANGED
          },
          {
            type: currencyActions.INPUT_TO_AMOUNT,
            exchangeAmount: 100
          },
          {
            type: currencyActions.SWAP_CURRENCY
          },
          {
            type: global.CACULATE_SOURCE_AMOUNT
          }
        ]
        store = mockStore({
          currency: {
            isExchangeFromFocused: true,
            exchangeFrom: {
              currencyCode: 0,
              exchangeAmount: 100
            },
            exchangeTo: {
              currencyCode: 1,
              exchangeAmount: 200
            }
          }
        })
          console.log('ccccccc-------',store.dispatch)

        return store.dispatch(currencyActions.handleFromCurrencyChanged()).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
        }) 
      })
    })

  })


})