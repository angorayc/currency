import React from 'react'
import ExchangeFromContainer from '../containers/ExchangeFromContainer'
import ExchangeToContainer from '../containers/ExchangeToContainer'
import Divider from '@material-ui/core/Divider'

class Exchange extends React.Component {
  render() {
    return (
      <div>
        <div>Exchange</div>
        <ExchangeFromContainer />
        <Divider />
        <ExchangeToContainer />
      </div>
    )
  }
}

export default Exchange