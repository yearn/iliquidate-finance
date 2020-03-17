import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Asset from './asset'
import Loader from '../loader'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_DEBT_BALANCES,
  DEBT_BALANCES_RETURNED,
  CLOSE_POSITION_RETURNED,
  WITHDRAW_PRINCIPAL_RETURNED,
  REPAY_DEBT_RETURNED,
} from '../../constants'

import { withNamespaces } from 'react-i18next';
import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px',
    borderRadius: '1.25em',
    maxWidth: '800px',
    width: '100%',
    justifyContent: 'center',
    marginTop: '20px',
    [theme.breakpoints.up('md')]: {
      padding: '24px',
    }
  },
  card: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '800px',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: '1000px',
    padding: '12px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    minWidth: '100%',
    marginBottom: '24px',
    marginTop: '24px'
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '100px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '0.75rem',
    height: 'max-content',
    [theme.breakpoints.up('md')]: {
      maxWidth: '130px',
      width: '100%'
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  notConnectedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  totalsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    maxWidth: '1000px',
    flexWrap: 'wrap'
  },
  totalCard: {
    flex: 1,
    borderRadius: '1.25rem',
    flexDirection: 'column',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    margin:'12px'
  },
  totalAmount: {
    paddingTop: '24px',
    flex: 1,
    fontSize: '36px'
  },
  totalTitle: {
    padding: '24px',
    flex: 1
  },
  expansionPanel: {
    width: '100%',
    maxWidth: '976px'
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
});

class Trade extends Component {

  constructor() {
    super()

    const account = store.getStore('account')
    const syntheticAssets = store.getStore('syntheticAssets')


    this.state = {
      account: account,
      syntheticAssets: syntheticAssets,
      totalDebt: syntheticAssets ? syntheticAssets.reduce((accumulator, currentValue) => accumulator + currentValue.debt, 0) : 0,
      totalInterest: syntheticAssets ? syntheticAssets.reduce((accumulator, currentValue) => accumulator + currentValue.interest, 0) : 0,
      totalCollateral: store.getStore('sCrvBalance')
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_DEBT_BALANCES, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(DEBT_BALANCES_RETURNED, this.debtReturned);
    emitter.on(REPAY_DEBT_RETURNED, this.txReturned);
    emitter.on(CLOSE_POSITION_RETURNED, this.txReturned);
    emitter.on(WITHDRAW_PRINCIPAL_RETURNED, this.txReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(DEBT_BALANCES_RETURNED, this.debtReturned);
    emitter.removeListener(REPAY_DEBT_RETURNED, this.txReturned);
    emitter.removeListener(CLOSE_POSITION_RETURNED, this.txReturned);
    emitter.removeListener(WITHDRAW_PRINCIPAL_RETURNED, this.txReturned);
  };

  debtReturned = () => {
    const syntheticAssets = store.getStore('syntheticAssets')

    this.setState({
      syntheticAssets: syntheticAssets,
      totalDebt: syntheticAssets.reduce((accumulator, currentValue) => accumulator + currentValue.debt, 0),
      totalInterest: syntheticAssets.reduce((accumulator, currentValue) => accumulator + currentValue.interest, 0),
      totalCollateral: store.getStore('sCrvBalance')
     })
  };

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: GET_DEBT_BALANCES, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  };

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  txReturned = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };


  render() {
    const { classes, t } = this.props;
    const {
      account,
      loading,
      modalOpen,
      snackbarMessage,
      totalCollateral,
      totalDebt,
      totalInterest,
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.notConnectedContainer }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('Trade.Intro') }</Typography>
            </div>
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('Trade.Connect') }</Typography>
              </Button>
            </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.intro }>
              <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                <Typography variant={ 'h5'} noWrap>{ address }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>

            <div className={ classes.totalsContainer }>
              <Card className={ classes.totalCard }>
                <Typography variant={'h1'} className={ classes.totalAmount }>$ { totalCollateral ? totalCollateral.toFixed(4) : '0.0000' }</Typography>
                <Typography variant={'h3'} className={ classes.totalTitle }>Total Collateral</Typography>
              </Card>

              <Card className={ classes.totalCard }>
                <Typography variant={'h1'} className={ classes.totalAmount }>$ { totalDebt ? totalDebt.toFixed(4) : '0.0000' }</Typography>
                <Typography variant={'h3'} className={ classes.totalTitle }>Total Debt</Typography>
              </Card>

              <Card className={ classes.totalCard }>
                <Typography variant={'h1'} className={ classes.totalAmount }>$ { totalInterest ? totalInterest.toFixed(4) : '0.0000' }</Typography>
                <Typography variant={'h3'} className={ classes.totalTitle }>Total Interest</Typography>
              </Card>
            </div>

            { this.renderAssetBlock() }
          </div>
        }
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  renderAssetBlock = () => {
    const { syntheticAssets, expanded } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth

    return syntheticAssets.map((asset) => {
      return (
        <ExpansionPanel className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  {/*<img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height={ width > 600 ? '40px' : '30px'}
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />*/}
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.balance).toFixed(4) + ' ' + asset.symbol }</Typography>
                <Typography variant={ 'h5' }>{ t('Trade.Position') }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{(asset.debt).toFixed(4)+' ' + asset.symbol}</Typography>
                <Typography variant={ 'h5' }>{ t('Trade.Debt') }</Typography>
              </div>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Trade)));
