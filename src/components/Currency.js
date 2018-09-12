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
import { validateInput } from '../helper'

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
  exchangeAmount: {
    textAlign: 'right'
  },
  exchangeHint: {
    color: configs.colors.pink,
    textAlign: 'right'
  }
})

class Currency extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      exchangeAmount: props.exchangeAmount,
      symbol: props.exchangeType === 'from' ? '-' : '+',
      isActive: props.isActive
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

    if (typeof onAmountFocus === 'function' && this.state.isActive)
      onAmountFocus()
  }

  _handleAmountChange = event => {
    let { onAmountChange } = this.props
    let amount = event.target.value

    if (amount !== '') {
        if(amount === '.')
          amount = `0.`
        else if (amount.match(/^[+-]/))
          amount = amount.slice(1)

        if (!validateInput(amount))
          amount = amount.slice(0, -1)

      if (amount.match(/^0\d{1,}/)) {
        amount = amount.slice(1)
      }
    }

    onAmountChange(amount)
    this.setState({ exchangeAmount: amount })
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
    let showHint = exchangeAmount > 0 && exchangeAmount < configs.exchange.MIN_EXCHANGE_AMOUNT
    let isFrom = exchangeType === 'from'
    let balanceClassNames = classnames({
        [classes.exchangeHint]: exchangeAmount > balance && isFrom
      })
    let showFee = !isActive && fee
    let rootClasses = classnames({
      'Px-12': true,
      [classes.exchangeFromContainer]: isFrom,
      [classes.exchangeToContainer]: !isFrom
    })
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
              <Input className="exchange-amount"
                  disableUnderline={true}
                  fullWidth={true}
                  autoFocus={isActive}
                  placeholder="0"
                  value={displayAmount}
                  onFocus={this._handleAmountFocus}
                  onChange={this._handleAmountChange}
                  inputRef={this.inputRef} />
              { showHint && isActive ? <FormHelperText className={classes.exchangeHint}>
                  Minimun amount is <span className={currencyName}>{configs.exchange.MIN_EXCHANGE_AMOUNT}</span>
                  </FormHelperText> : null }
              { showFee ? <FormHelperText>
                  Inc. fee <span className={currencyName}>{fee}</span>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                  </FormHelperText> : null }
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