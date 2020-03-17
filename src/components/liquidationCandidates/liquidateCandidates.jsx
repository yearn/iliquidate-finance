import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  TextField,
  IconButton
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import Web3 from 'web3';
import Loader from '../loader'
import UnlockModal from '../unlock/unlockModal.jsx'
import Snackbar from '../snackbar'
import { colors } from '../../theme'
import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  LIQUIDATE,
  LIQUIDATE_RETURNED,
  GET_LIQUIDATION_CANDIDATES,
  LIQUIDATION_CANDIDATES_RETURNED,
  REFRESH_LIQUIDATION_CANDIDATES,
  REFRESH_LIQUIDATION_CANDIDATES_RETURNED
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iHaveContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '12px',
    borderRadius: '1.25em',
    maxWidth: '1400px',
    justifyContent: 'center',
    marginTop: '20px',
    [theme.breakpoints.up('md')]: {
      padding: '24px',
    }
  },
  iWantContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: '24px'
  },
  conversionRatioContainer: {
    width: '100%',
    display: 'flex'
  },
  sendingContainer: {
    flex: 1,
    display: 'flex',
  },
  receivingContainer: {
    flex: 1,
    display: 'flex',
  },
  feesContainer: {
    display: 'flex'
  },
  card: {
    width: '100%',
    display: 'flex',
    marginTop: '60px',
    flexWrap: 'wrap',
    maxWidth: '1400px',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1000px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
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
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputCardHeading: {
    width: '100%',
    padding: '12px 0px 12px 20px'
  },
  liquidationContent: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  heading: {
    paddingTop: '24px',
    paddingBottom: '12px',
    minWidth: '100%'
  },
  value: {
    flex: 1,
    maxWidth: '350px',
    minWidth: '300px',
    paddingBottom: '6px'
  },
  successValue: {
    flex: 1,
    maxWidth: '350px',
    minWidth: '300px',
    paddingBottom: '6px',
    color: colors.green
  },
  errorValue: {
    flex: 1,
    maxWidth: '350px',
    minWidth: '300px',
    paddingBottom: '6px',
    color: colors.red
  },
  valueHeading: {
    fontWeight: 'bold',
    width: '100px',
    paddingBottom: '6px'
  },
  pairs: {
    borderRadius: '20px',
    padding: '24px',
    height: 'max-content',
    marginTop: '20px'
  },
  tablesContainer: {
    display: 'flex'
  },
  tableContainer: {
    flexWrap: 'wrap',
    maxWidth: 'calc(100vw - 68px)',
    overflowX: 'auto'
  },
  headerValue: {
    fontWeight: 'bold',
    width: '300px',
    padding: '6px 12px',
    paddingBottom: '12px',
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'center',
  },
  headerValueHF: {
    fontWeight: 'bold',
    width: '150px',
    padding: '6px 12px',
    paddingBottom: '12px',
    justifyContent: 'flex-end',
    display: 'flex',
    alignItems: 'center',
  },
  aggregatedHeader: {
    textAlign: 'center',
  },
  pair: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  healthFactor: {
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '55px'
  },
  apr: {
    padding: '6px 12px',
    width: '300px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '55px'
  },
  successValue: {
    color: colors.green
  },
  errorValue: {
    color: colors.red
  },
});

class Liquidate extends Component {

  constructor() {
    super()

    const account = store.getStore('account')
    let web3 = null

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_LIQUIDATION_CANDIDATES, content: {} })
      web3 = new Web3(store.getStore('web3context').library.provider);
    }

    this.state = {
      account: account,
      liquidationCandidates: [],
      web3: web3
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(LIQUIDATE_RETURNED, this.liquidateReturned);
    emitter.on(LIQUIDATION_CANDIDATES_RETURNED, this.liquidationCandidatesReturned);
    emitter.on(REFRESH_LIQUIDATION_CANDIDATES_RETURNED, this.refreshLiquidationCandidatesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(LIQUIDATE_RETURNED, this.liquidateReturned);
    emitter.removeListener(LIQUIDATION_CANDIDATES_RETURNED, this.liquidationCandidatesReturned);
    emitter.removeListener(REFRESH_LIQUIDATION_CANDIDATES_RETURNED, this.refreshLiquidationCandidatesReturned);
  };

  refresh = () => {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: REFRESH_LIQUIDATION_CANDIDATES, content: {} })
  }

  refreshLiquidationCandidatesReturned = (liquidationCandidates) => {
    this.setState({ liquidationCandidates, loading: false })
  }

  liquidationCandidatesReturned = (liquidationCandidates) => {
    this.setState({ liquidationCandidates })

    setTimeout(() => {
      dispatcher.dispatch({ type: GET_LIQUIDATION_CANDIDATES, content: {} })
    }, 5000)
  }

  liquidateReturned = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false, address: '' })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  }

  connectionConnected = () => {
    const { t } = this.props
    const web3 = new Web3(store.getStore('web3context').library.provider);

    this.setState({ account: store.getStore('account'), web3: web3 })

    dispatcher.dispatch({ type: GET_LIQUIDATION_CANDIDATES, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  errorReturned = (error) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes, t } = this.props;
    const {
      address,
      addressError,
      account,
      loading,
      modalOpen,
      snackbarMessage,
      liquidationData,
      allGood
    } = this.state

    var addy = null;
    if (account.address) {
      addy = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        { !account.address &&
          <div className={ classes.investedContainer }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h2'>{ t('Liquidate.Intro') }</Typography>
            </div>
            <div className={ classes.connectContainer }>
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                disabled={ loading }
                onClick={ this.overlayClicked }
                >
                <Typography className={ classes.buttonText } variant={ 'h5'}>{ t('Liquidate.Connect') }</Typography>
              </Button>
            </div>
          </div>
        }
        { account.address &&
          <div className={ classes.card }>
            <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.intro }>
              <Typography variant='h2' className={ classes.introText }>{ t('Liquidate.Intro') }</Typography>
              <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
                <Typography variant={ 'h5'} noWrap>{ addy }</Typography>
                <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
              </Card>
            </div>
            <Card className={ classes.pairs }>
              <table className={ classes.tableContainer }>
                { this.renderCandidatesHeader() }
                { this.renderCandidates() }
              </table>
            </Card>
            <div className={ classes.introCenter }>
            </div>
          </div>
        }
        { modalOpen && this.renderModal() }
        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  };

  renderCandidatesHeader = () => {
    const { classes } = this.props
    const headers = [ 'address', 'health factor', 'collateral', 'debt', 'action', <IconButton onClick={ this.refresh }><RefreshIcon /></IconButton>]

    return (
      <tr className={ classes.pair }>
        { headers.map((header) => {
          return (<th key={ header } className={ ['address'].includes(header) ? classes.headerValue : classes.headerValueHF }>
            <Typography  align='right' variant={'h4'} className={classes.aggregatedHeader}>{ header }</Typography>
          </th>)
        })}
      </tr>
    )
  }

  renderCandidates = () => {
    const { classes, t } = this.props
    const { liquidationCandidates, loading } = this.state

    return (
      liquidationCandidates
      .map((y) => {

        const collateralGood = y && y.maxCollateral && y.maxCollateral._reserve !== '0x0000000000000000000000000000000000000000'
        const debtGood = y && y.maxDebt && y.maxDebt._reserve !== '0x0000000000000000000000000000000000000000'
        const healthFactorGood = y.user.healthFactor < 1

        return (
          <tr key={ y.address } className={ classes.pair }>
            <td className={ classes.apr }>
              <Typography variant={'h4'} >{ y.user.id }</Typography>
            </td>
            <td className={ classes.healthFactor }>
              <Typography align='right' color='secondary' noWrap className={ healthFactorGood ? classes.successValue : classes.errorValue }>{ parseFloat(y.user.healthFactor).toFixed(4) }</Typography>
            </td>
            <td className={ classes.healthFactor }>
              <Typography align='right' color='secondary' noWrap className>{ y && y.maxCollateral ? this.mapAmount(y.maxCollateral._reserve, y.maxCollateral._amount) : '0' }</Typography>
              <Typography align='right' color='secondary' noWrap className={ collateralGood ? classes.successValue : classes.errorValue }>{ y && y.maxCollateral ? this.mapAddress(y.maxCollateral._reserve) : '0x0000000000000000000000000000000000000000' }</Typography>
            </td>
            <td className={ classes.healthFactor }>
              <Typography align='right' color='secondary' noWrap>{ y && y.maxDebt ? this.mapAmount(y.maxDebt._reserve, y.maxDebt._amount) : '0' }</Typography>
              <Typography align='right' color='secondary' noWrap className={ debtGood ? classes.successValue : classes.errorValue }>{ y && y.maxDebt ? this.mapAddress(y.maxDebt._reserve) : '0x0000000000000000000000000000000000000000' }</Typography>
            </td>
            <td className={ classes.apr }>
              { (collateralGood && debtGood && healthFactorGood) &&
              <Button
                className={ classes.actionButton }
                variant="outlined"
                color="primary"
                size='small'
                disabled={ loading}
                onClick={ () => { this.onLiquidate(y.user.id) } }
                fullWidth
                >
                <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>{ t('Liquidate.Liquidate') }</Typography>
              </Button>}
            </td>
          </tr>)
      })
    )
  }

  mapAddress = (address) => {
    address = address.toLowerCase();
    if (address == '0x6b175474e89094c44da98b954eedeac495271d0f') {
      return 'DAI';
    } else if (address == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
      return 'USDC';
    } else if (address == '0x57ab1ec28d129707052df4df418d58a2d46d5f51') {
      return 'SUSD';
    } else if (address == '0x0000000000085d4780b73119b644ae5ecd22b376') {
      return 'TUSD';
    } else if (address == '0xdac17f958d2ee523a2206206994597c13d831ec7') {
      return 'USDT';
    } else if (address == '0x0d8775f648430679a709e98d2b0cb6250d2887ef') {
      return 'BAT';
    } else if (address == '0xdd974d5c2e2928dea5f71b9825b8b646686bd200') {
      return 'KNC';
    } else if (address == '0x80fb784b7ed66730e8b1dbd9820afd29931aab03') {
      return 'LEND';
    } else if (address == '0x514910771af9ca656af840dff83e8264ecf986ca') {
      return 'LINK';
    } else if (address == '0x0f5d2fb29fb7d3cfee444a200298f468908cc942') {
      return 'MANA';
    } else if (address == '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2') {
      return 'MKR';
    } else if (address == '0x1985365e9f78359a9b6ad760e32412f4a445e862') {
      return 'REP';
    } else if (address == '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
      return 'SNX';
    } else if (address == '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599') {
      return 'WBTC';
    } else if (address == '0xe41d2489571d322189246dafa5ebde1f4699f498') {
      return 'ZRX';
    }
  }
  mapAmount = (address, amount) => {
    address = address.toLowerCase();
    amount = parseFloat(amount);
    if (address == '0x6b175474e89094c44da98b954eedeac495271d0f') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
      return (amount/1e6).toFixed(4);
    } else if (address == '0x57ab1ec28d129707052df4df418d58a2d46d5f51') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x0000000000085d4780b73119b644ae5ecd22b376') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0xdac17f958d2ee523a2206206994597c13d831ec7') {
      return (amount/1e6).toFixed(4);
    } else if (address == '0x0d8775f648430679a709e98d2b0cb6250d2887ef') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0xdd974d5c2e2928dea5f71b9825b8b646686bd200') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x80fb784b7ed66730e8b1dbd9820afd29931aab03') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x514910771af9ca656af840dff83e8264ecf986ca') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x0f5d2fb29fb7d3cfee444a200298f468908cc942') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x1985365e9f78359a9b6ad760e32412f4a445e862') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
      return (amount/1e18).toFixed(4);
    } else if (address == '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599') {
      return (amount/1e8).toFixed(4);
    } else if (address == '0xe41d2489571d322189246dafa5ebde1f4699f498') {
      return (amount/1e18).toFixed(4);
    }
  }

  onLiquidate = (address) => {
    this.setState({ loading: true })
    dispatcher.dispatch({ type: LIQUIDATE, content: { address } })
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

export default withNamespaces()(withRouter(withStyles(styles)(Liquidate)));
