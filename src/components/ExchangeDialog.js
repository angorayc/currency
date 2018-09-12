import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import configs from '../configs'

const options = ['View upgrade options', 'Got it']
const styles = {
  listItem: {
    textAlign: 'center',
    color: configs.colors.blue
  },
  listCenter: {
    textAlign: 'center'
  },
  list: {
    display: 'flex',
    justifyContent: 'center'
  }
}

class ExchangeLimitDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = value => {
    this.props.onClose(value)
  }

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title" className={classes.listCenter}>FX exchange limit fee</DialogTitle>
        <DialogContent>
          <p className={classes.listCenter}>You've reached your free exchange limit of <span className="EUR">5,000</span> per month.
          Further accumulative cross-currency transactions will incur 0.5% fee.</p>
          <p className={classes.listCenter}>Upgrade to Premium to get unlimited free exchanges</p>
        </DialogContent>
        <div>
          <List>
            {options.map(option => (
              <ListItem button className={classes.list} onClick={() => this.handleListItemClick(option)} key={option}>
                <span className={classes.listItem}>{option}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </Dialog>
    )
  }
}

ExchangeLimitDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
}

const ExchangeDialog = withStyles(styles)(ExchangeLimitDialog)

export default ExchangeDialog