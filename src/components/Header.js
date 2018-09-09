import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'

export default class Header extends React.Component {

  render() {
    return (
      <div className="header">
        <IconButton className="header-close">
          <CloseIcon />
        </IconButton>
        <span className="header-title">Exchange</span>
        <IconButton className="header-trend">
          <TrendingUpIcon />
        </IconButton>
      </div>
    );
  }
}
