import React from 'react'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import configs from '../configs'

const styles = theme => ({
  divider: {
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white'
  },
  separator: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: '0',
    background: configs.colors.gray1
  },
  exchangeRateBtn: {
    verticalAlign: 'middle',
    width: '140px',
    height: '48px',
    background: 'white',
    border: `2px solid ${configs.colors.gray1}`,
    color: configs.colors.blue,
    boxShadow: 'none',
    '&:hover': {
      background: 'white'
    }
  },
  exchangeSwapBtn: {
    background: 'white',
    border: `2px solid ${configs.colors.gray1}`,
    color: configs.colors.blue,
    boxShadow: 'none',
    '&:hover': {
      background: 'white'
    }
  },
  placeholder: {
    display: 'inline-block',
    width: '40px',
    height: '40px'
  }
})

class ExchangeRate extends React.Component {

  constructor(props) {
    super(props)
    this.timer = null
  }

  componentDidMount() {
    let { getRate } = this.props
    if (typeof getRate === 'function') {
      getRate()
    }
  }

  componentWillUnmount() {
    this.props.getRateStop()
  }

  _handleSwapBtnClicked = event => {
    let { onSwapBtnClicked } = this.props
    if (typeof onSwapBtnClicked === 'function')
      onSwapBtnClicked()
  }

  render() {
    let { exchangeRate, currencyFromName, currencyToName, classes } = this.props
    return (
      <div className={classes.divider}>
        <div className={classes.separator}>
        </div>
        <span className="Px-12">
          <Button variant="fab" color="primary" mini onClick={this._handleSwapBtnClicked} className={classes.exchangeSwapBtn}>
            <ImportExportIcon />
          </Button>
        </span>
        
          <span>
            <Button variant="extendedFab" color="primary" className={classes.exchangeRateBtn}>
              <TrendingUpIcon />
              {
                exchangeRate ? (
                <span>
                <span className={currencyFromName}>1</span>
                <span className="rate-eq">=</span>
                <span className={currencyToName}>
                  { 
                    (exchangeRate || '').split('').map(
                      (digit, idx) => <span key={`exchange-${idx}-${digit}`} className="exchange-digit">{digit}</span>
                    )
                  }
                </span>
                </span> ) : null
              }
            </Button>
          </span>
        <span className={`Px-12 ${classes.placeholder}`}></span>
      </div>
    )
  }
}

export default withStyles(styles)(ExchangeRate)