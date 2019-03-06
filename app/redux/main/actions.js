import {MNEMONICS_GENERATED, BITCOIN_BALANCE_CALCUATED, MNEMONICS_VALIDATION, BTC_XPUB, ETH_XPUB, NEM_ADDRESS, ETHEREUM_BALANCE_CALCUATED, NEM_BALANCE_CALCUATED} from './constants';
import {generateMnemonics, getXPub} from '../../utils/walletUtils';
import BitcoinWallet, {bnet, getTransactionsList, sendTransactionBTC, getBalanceForMnemonics, validateMnemonics} from '../../domains/bitcoin';
import { getEthBalance } from '../../domains/ethereum'
import {generateXPubFromMnemonics, sendTransactionEth } from '../../domains/ethereum';
import { getAddress, privateKey, getNEMBalance, sendTransactionNEM } from '../../domains/nem';
import database from '../../utils/database';

const Mnemonics = database.mnemonics;

export const generateMnemonicsAction = () => {
    return async (dispatch) => {
        const mnemonics = await generateMnemonics();
        // const xpub = 'xpub69VALARCTZ12pptZKtmCvUmDkgwd9TLn69cR8mSSfLJUyeA3hvevnTd4hwQ5BzHyDrE9ao9zfkUBkPgJsyC5H1z336AhTw9L72M7TiYoXG5'        
        // sendTransaction()        
        dispatch({
            type: MNEMONICS_GENERATED,
            payload: mnemonics
        })         
        const xpub = __generateAddresses(mnemonics);        
        
        dispatch({
            type: BTC_XPUB,
            payload: xpub.btc_xpub
        })
        dispatch({
            type: ETH_XPUB,
            payload: xpub.eth_xpub
        })
        dispatch({
            type: NEM_ADDRESS,
            payload: xpub.nem_address
        })
    }
};

export const sendTransactionActionEthereum = (mnemonics, to, amount) => {
    return async (dispatch) => {
        const eth_xpub = generateXPubFromMnemonics(mnemonics);    
        await sendTransactionEth(eth_xpub, to, amount);
    }
};

export const sendTransactionActionNEM = (to, amount, message) => {
    return async (dispatch) => {
        await sendTransactionNEM(privateKey, to, amount, message)
    }    
};

export const sendTransactionAction = (xpub, to, amount, mnemonics) => {
    return async (dispatch) => {
        await sendTransactionBTC(xpub, to, amount, mnemonics)
    }    
};

const __generateAddresses = (mnemonics) => {
    
    const btc_xpub = getXPub(mnemonics, bnet.current, BitcoinWallet.Defaults.Path);
    const eth_xpub = generateXPubFromMnemonics(mnemonics);    
    const nem_address = getAddress(privateKey);    
    
    return {
        btc_xpub, 
        eth_xpub,
        nem_address
    }
};

export const generateAddresses = (mnemonics) => {
    return async (dispatch) => {
        const xpub = __generateAddresses(mnemonics);
        
        dispatch({
            type: BTC_XPUB,
            payload: xpub.btc_xpub
        })
        dispatch({
            type: ETH_XPUB,
            payload: xpub.eth_xpub
        })        
        dispatch({
            type: NEM_ADDRESS,
            payload: xpub.nem_address
        })
    }
}

export const getBalanceAction = (mnemonics, eth_xpub, nem_address) => {
    return async (dispatch) => {
        const btcBalance = await getBalanceForMnemonics(mnemonics);
        const ethBalance = await getEthBalance(eth_xpub);
        const nemBalance = await getNEMBalance(nem_address);        
        dispatch({
            type: BITCOIN_BALANCE_CALCUATED,
            payload: btcBalance
        })
        dispatch({
            type: ETHEREUM_BALANCE_CALCUATED,
            payload: ethBalance
        })
        dispatch({
            type: NEM_BALANCE_CALCUATED,
            payload: nemBalance
        })
    }
}

export const validateMnemonicsAction = (mnemonics) => {
    return async (dispatch) => {
        const isValidMnemonics = validateMnemonics(mnemonics);
        dispatch({
            type: MNEMONICS_VALIDATION,
            payload: isValidMnemonics
        })        
        if (isValidMnemonics) {
            const m = await Mnemonics.findAll();
            if (m.length === 0) {
                const mn = await Mnemonics.insert({memonics: mnemonics});
                console.log('db: ' + mn);            
            } else {
                await Mnemonics.remove({_id: m[0]._id})
                const mn = await Mnemonics.insert({memonics: mnemonics});                
            }

            const xpub = __generateAddresses(mnemonics);        
            dispatch({
                type: BTC_XPUB,
                payload: xpub.btc_xpub
            })
            dispatch({
                type: ETH_XPUB,
                payload: xpub.eth_xpub
            })        
            dispatch({
                type: NEM_ADDRESS,
                payload: xpub.nem_address
            })
        } else {
            dispatch({
                type: BTC_XPUB,
                payload: 'Mnemonics is not valid!'
            })
            dispatch({
                type: ETH_XPUB,
                payload: 'Mnemonics is not valid!'
            })        
            dispatch({
                type: NEM_ADDRESS,
                payload: 'Mnemonics is not valid!'
            })
        }
    }
}
