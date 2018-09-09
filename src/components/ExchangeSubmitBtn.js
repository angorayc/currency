import React from 'react'
import Button from '@material-ui/core/Button'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

export default class ExchangeSubmitBtn extends React.Component {
  render() {
    return (
      <div className="exchange-divider">
        <Button variant="extendedFab" color="secondary" className="rate">
          <TrendingUpIcon />
          Exchange
        </Button>
      </div>
    )
  }
}
