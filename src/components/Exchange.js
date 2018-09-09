import React from 'react'
import Header from './Header'
import ExchangeFromContainer from '../containers/ExchangeFromContainer'
import ExchangeToContainer from '../containers/ExchangeToContainer'
import ExchangeRateContainer from '../containers/ExchangeRateContainer'

class Exchange extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <ExchangeFromContainer />
        <ExchangeRateContainer />
        <ExchangeToContainer />
      </div>
    )
  }
}

export default Exchange