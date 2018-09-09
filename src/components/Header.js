import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

export default class Header extends React.Component {

  render() {
    return (
      <div>
        <IconButton>
          <CloseIcon />
        </IconButton>
        <span>Exchange</span>
        <IconButton>
          <TrendingUpIcon />
        </IconButton>
      </div>
    );
  }
}
