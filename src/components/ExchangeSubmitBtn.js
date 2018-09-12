import React from 'react'
import Button from '@material-ui/core/Button'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import { withStyles } from '@material-ui/core/styles'
import configs from '../configs'

const styles = theme => ({
  submitContainer: {
    textAlign: 'center'
  },
  submitBtn: {
    background: configs.colors.pink,
    color: 'white',
    boxShadow: 'none',
    '&:disabled': {
      background: configs.colors.pink,
      opacity: 0.2,
      color: 'white'
    }
  } 
})

class ExchangeSubmitBtn extends React.Component {
  render() {
    let { enableExchangeBtn, classes } = this.props
    return (
      <div className={classes.submitContainer}>
        <Button variant="extendedFab" className={classes.submitBtn} disabled={!enableExchangeBtn}>
          <TrendingUpIcon />
          Exchange
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(ExchangeSubmitBtn)
