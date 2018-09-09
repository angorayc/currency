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

class Currency extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      exchangeAmount: props.exchangeAmount,
      symbol: props.exchangeType === 'from' ? '-' : '+'
    }
  }

  _handleCurrencyChange = name => event => {
    let currencyCode = event.target.value
    this.props.onCurrencyChange(currencyCode)
  }

  _handleAmountChange = event => {
    let { onAmountChange } = this.props
    let amount = event.target.value
    let matches

    if (amount !== '') {
      
      
        if(amount === '.')
          amount = `0.`
        else if (amount.match(/^[+-]/))
          amount = amount.slice(1)
        
        matches = (amount.match(/\D/g) || []).filter((m) => m !== '.')
        if(matches.length)
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
    return null
  }


  render() {
    let { currencyCode, exchangeType, balance, enableAmountInput, isActive } = this.props
    let currencyName = configs.currency[currencyCode]
    let { exchangeAmount, symbol } = this.state
    let displayAmount = exchangeAmount === '' ? exchangeAmount : `${symbol}${exchangeAmount}`
    let showHint = exchangeAmount > 0 && exchangeAmount < configs.exchange.MIN_EXCHANGE_AMOUNT
    let balanceClassNames = classnames({ 'exchange-hint': exchangeAmount > balance && isActive })
    return (
      <div className="Px-12">
        <List component="nav">
          <Grid container>
            <Grid item xs={3}>
              <FormControl className="exchange-select">
                <NativeSelect
                  value={currencyCode}
                  onChange={this._handleCurrencyChange(exchangeType)}
                  input={<Input name={exchangeType} id={exchangeType} value={currencyName}/>}
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
                fullWidth={true}
                autoFocus={isActive}
                placeholder="0"
                value={displayAmount}
                onChange={this._handleAmountChange}
                disabled={!enableAmountInput} />
              { showHint && isActive ? <FormHelperText className="exchange-hint">
                  Minimun amount is <span className={currencyName}>{configs.exchange.MIN_EXCHANGE_AMOUNT}</span>
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

export default Currency