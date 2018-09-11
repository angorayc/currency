import React from 'react'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

export default class ExchangeRate extends React.Component {

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
    let { exchangeRate, currencyFromName, currencyToName } = this.props
    return (
      <div className="exchange-divider">
        <Divider className="exchange-separator"/>
        <span className="exchange-swap Px-12">
          <Button variant="fab" color="primary" onClick={this._handleSwapBtnClicked}>
            <ImportExportIcon />
          </Button>
        </span>
        { 
          exchangeRate ? (
          <span className="exchange-rate">
            <Button variant="extendedFab" color="primary" className="rate">
              <TrendingUpIcon />
              <span className={currencyFromName}>1</span>
              <span className="rate-eq">=</span>
              <span className={currencyToName}>
                { exchangeRate.split('').map((digit, idx) => <span key={`exchange-${idx}-${digit}`} className="exchange-digit">
                  {digit}</span>)
                }
              </span>
            </Button>
          </span>) : null
        }
      </div>
    )
  }
}
