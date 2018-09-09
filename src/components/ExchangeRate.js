import React from 'react'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import Button from '@material-ui/core/Button'

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
    return (
      <div>
        <IconButton variant="fab" color="primary" onClick={this._handleSwapBtnClicked}>
          <ImportExportIcon />
        </IconButton>
        <Divider />
        <Button variant="extendedFab" color="secondary">
          <TrendingUpIcon />
          ExchangeRate
        </Button>
      </div>
    )
  }
}
