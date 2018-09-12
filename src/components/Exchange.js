import React from 'react'
import Header from './Header'
import ExchangeFromContainer from '../containers/ExchangeFromContainer'
import ExchangeToContainer from '../containers/ExchangeToContainer'
import ExchangeRateContainer from '../containers/ExchangeRateContainer'
import ExchangeSubmitContainer from '../containers/ExchangeSubmitContainer'
import { withStyles } from '@material-ui/core/styles'
import configs from '../configs'

const styles = () => ({
  root: {
    background: configs.colors.gray1,
    minHeight: '100vh'
  }
})

class Exchange extends React.Component {

  render() {

    let { classes } = this.props

    return (
      <div className={classes.root}>
        <Header />
        <ExchangeFromContainer />
        <ExchangeRateContainer />
        <ExchangeToContainer />
        <ExchangeSubmitContainer />
      </div>
    )
  }
}

export default withStyles(styles)(Exchange)