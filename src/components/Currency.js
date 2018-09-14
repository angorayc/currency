import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import Grid from '@material-ui/core/Grid'
import configs from '../configs'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import { withStyles } from '@material-ui/core/styles'
import { validateInput, extractValue, validateInputLength } from '../helper'
import numeral from 'numeral'
import ExchangeDialog from './ExchangeDialog'

const options = ['View upgrade options', 'Got it']
const styles = () => ({
  exchangeFromContainer: {
    background: 'white'
  },
  exchangeToContainer: {
    background: configs.colors.gray1
  },
  exchangeSelect: {
    width: '100%',
    paddingRight: '8px',
    boxSizing: 'border-box'
  },
  exchangeInput: {
    width: '100%',
    textAlign: 'right'
  },
  exchangeAmount: {
    textAlign: 'right'
  },
  balanceHint: {
    textAlign: 'left',
    color: configs.colors.pink
  },
  feeHint: {
    textAlign: 'right'
  },
  exchangeHint: {
    textAlign: 'right',
    color: configs.colors.pink
  },
  infoIcon: {
    verticalAlign: 'middle',
    width: '12px',
    height: '12px',
    paddingLeft: '10px'
  },
  infoIconBtn: {
    height: 'auto',
    width: 'auto'
  },
  currency: {
    verticalAlign: 'middle'
  }
})

class Currency extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      exchangeAmount: props.exchangeAmount,
      symbol: props.exchangeType === 'from' ? '-' : '+',
      isActive: props.isActive,
      open: false,
      selectedValue: options[1],
    }
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    if (this.props.exchangeType === 'from')
      this.inputRef.current.focus()
    
  }

  componentDidUpdate() {
    if (this.props.enableAmountInput && this.props.isActive) {
      this.inputRef.current.focus()
    }
  }

  _handleCurrencyChange = name => event => {
    let currencyCode = event.target.value
    let { onCurrencyChange } = this.props

    if (typeof onCurrencyChange === 'function')
      onCurrencyChange(currencyCode)
  }

  _handleAmountFocus = event => {
    let { onAmountFocus } = this.props

    if (typeof onAmountFocus === 'function')
      onAmountFocus()
  }

  _handleAmountChange = event => {
    let { onAmountChange } = this.props
    let amount = extractValue(event.target.value)
    let matches = amount.match(/^(\.)(\d{0,2})/)

    if (!validateInput(amount) || !validateInputLength(amount))
      return

    
    if (amount !== '') {
      if(matches)
        amount = `0${matches[1]}${matches[2]}`

      if (amount.match(/^0\d{1,}/)) {
        amount = amount.slice(1)
      }
    }

    onAmountChange(amount)
    this.setState({ exchangeAmount: amount })
  }

  _handleClickOpen = () => {
    this.setState({
      open: true,
    })
  }

  _handleClose = value => {
    this.setState({ selectedValue: value, open: false })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (parseFloat(nextProps.exchangeAmount, 10) !== parseFloat(prevState.exchangeAmount, 10)) {
      return {
        exchangeAmount: nextProps.exchangeAmount
      }
    }

    if (nextProps.isActive !== prevState.isActive) {
      return {
        isActive: nextProps.isActive
      }
    }
    return null
  }


  render() {
    let { currencyCode, exchangeType, balance, fee, classes } = this.props
    let currencyName = configs.currency[currencyCode]
    let { exchangeAmount, symbol, isActive } = this.state
    let displayAmount = exchangeAmount === '' ? exchangeAmount : `${symbol}${exchangeAmount}`
    let showMinAmountHint = exchangeAmount > 0 && exchangeAmount < configs.exchange.MIN_EXCHANGE_AMOUNT
    let isFrom = exchangeType === 'from'
    let balanceClassNames = classnames({
        [classes.balanceHint]: true
      })
    let showFee = !isActive && fee
    let rootClasses = classnames({
      'Px-12': true,
      [classes.exchangeFromContainer]: isFrom,
      [classes.exchangeToContainer]: !isFrom
    })
    let minAmount = showMinAmountHint ? numeral(configs.exchange.MIN_EXCHANGE_AMOUNT).format('0.00') : ''
    let displayFee = showFee? numeral(fee || 0).format('0,0.00') : ''

    return (
      <div className={rootClasses}>
        <List component="nav">
          <Grid container>
            <Grid item xs={3}>
              <FormControl className={classes.exchangeSelect}>
                <NativeSelect
                  value={currencyCode}
                  onChange={this._handleCurrencyChange(exchangeType)}
                  input={<Input name={exchangeType} id={exchangeType} value={currencyName} disableUnderline={true}/>}
                >
                  { Object.keys(configs.currency).map((c) => <option key={configs.currency[c]} value={c}>{configs.currency[c]}</option>)}
                  
                </NativeSelect>
                <FormHelperText className={balanceClassNames}>
                  Balance: <span className={currencyName}>{balance}</span>
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={9}>
              <FormControl className={classes.exchangeInput}>
              <Input className="exchange-amount"
                  disableUnderline={true}
                  fullWidth={true}
                  autoFocus={isActive}
                  placeholder="0"
                  value={displayAmount}
                  onFocus={this._handleAmountFocus}
                  onChange={this._handleAmountChange}
                  inputRef={this.inputRef} />
              { showMinAmountHint && isActive ? <FormHelperText className={classes.exchangeHint}>
                  Minimun amount is <span className={currencyName}>{minAmount}</span>
                  </FormHelperText> : null }
              { showFee ? <FormHelperText className={classes.feeHint}>
                  Inc. fee <span className={classnames(currencyName, classes.currency)}>{displayFee}</span>
                  <IconButton className={classes.infoIconBtn} onClick={this._handleClickOpen}><InfoIcon className={classes.infoIcon} /></IconButton>
                  </FormHelperText> : null }
                  <ExchangeDialog
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={this._handleClose}
                  />
              </FormControl>
            </Grid>
          </Grid>
        </List>
      </div>
    )
  }
}


Currency.propTypes = {
  onCurrencyChange: PropTypes.func,
  currencyCode: PropTypes.number,
  currencyType: PropTypes.oneOf(['From', 'To']),
  exchangeAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  balance:PropTypes.number
}

export default withStyles(styles)(Currency)