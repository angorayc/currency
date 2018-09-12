import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/CloseRounded'
import TrendingUpIcon from '@material-ui/icons/TrendingUpRounded'
import { withStyles } from '@material-ui/core/styles'
import configs from '../configs'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'white'
  },
  iconTrending: {
    borderRadius: '50%',
    backgroundColor: configs.colors.black,
    color: 'white',
    fontSize: '16px'
  },
  iconClose: {
    color: configs.colors.black,
    fontSize: '16px'
  },
  title: {
    color: configs.colors.black,
    paddingTop: '15px',
    paddingBottom: '15px',
    display: 'inline-block'
  }
})

function Header(props) {

  const { classes } = props
  return (
    <div className={classes.root}>
      <IconButton>
        <CloseIcon className={classes.iconClose}/>
      </IconButton>
      <span className={classes.title}>Exchange</span>
      <IconButton>
        <TrendingUpIcon className={classes.iconTrending}/>
      </IconButton>
    </div>
  )
}

export default withStyles(styles)(Header)
