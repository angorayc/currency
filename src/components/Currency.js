import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import Input from '@material-ui/core/Input'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import configs from '../configs'

class Currency extends React.Component {

  constructor(props) {
    super(props)
    this.state = { exchangeAmount: props.exchangeAmount }
  }

  _handleCurrencyChange = name => event => {
    let currencyCode = event.target.value
    this.props.onCurrencyChange({
      currencyCode: currencyCode,
      currencyName: configs.currency[currencyCode]
    })
  }

  _handleAmountChange = event => {
    let amount = event.target.value
    if(amount === '.')
      amount = `0.`
    else {
      if (amount.length > 1 && amount.indexOf('0') === 0 && amount.indexOf('.') === -1)
        amount = amount.slice(1)  
    }
    

    this.props.onAmountChange(amount)
    this.setState({ exchangeAmount: amount })
  }

  render() {
    let { currencyCode, exchangeType, balance } = this.props
    let { exchangeAmount } = this.state
    return (
      <List component="nav">
        <FormControl>
          <NativeSelect
            value={currencyCode}
            onChange={this._handleCurrencyChange(exchangeType)}
            input={<Input name={exchangeType} id={exchangeType} />}
          >
            { Object.keys(configs.currency).map((c) => <option key={configs.currency[c]} value={c}>{configs.currency[c]}</option>)}
            
          </NativeSelect>
          <FormHelperText>Balance: {balance}</FormHelperText>
          { exchangeAmount ? <span className={`exchange-${exchangeType}`}></span> : null }
          <Input value={exchangeAmount} onChange={this._handleAmountChange} placeholder="0" />
        </FormControl>
      </List>
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