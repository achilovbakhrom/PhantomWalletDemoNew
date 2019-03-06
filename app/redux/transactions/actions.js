import {
    BTC_TRANSACTIONS,
    NEM_TRANSACTIONS,
    ETH_TRANSACTIONS
} from './constants';
import BitcoinWallet, {bnet} from '../../domains/bitcoin';
import database from '../../utils/database';

import {getXPub} from '../../utils/walletUtils';
import {generateXPubFromMnemonics, getTransactionEth} from '../../domains/ethereum'
import { getTransactionsList } from '../../domains/bitcoin';
import { getAddress, privateKey, getTransactions} from '../../domains/nem';


const Mnemonics = database.mnemonics;

export const getBTCtxs = () => {
    return async (dispatch) => {        
        const mn = await Mnemonics.findAll();
        if (mn.length !== 0) {            
            const temp = mn[0];            
            const xpub = getXPub(temp.memonics, bnet.current, BitcoinWallet.Defaults.Path)
            const txList = await getTransactionsList(xpub);
            dispatch({
                type: BTC_TRANSACTIONS,
                payload: txList
            })
        }       
    }
}

export const getEthTxs = () => {
    return async (dispatch) => {
        const mn = await Mnemonics.findAll();
        if (mn.length !== 0) {            
            const temp = mn[0];            
            
            const address = generateXPubFromMnemonics(temp.memonics)
            const response = await getTransactionEth(address);
            console.log('eth txList')            
            dispatch({
                type: ETH_TRANSACTIONS,
                payload: response.data.result
            })
        }       
        
        
    }
}

export const getNEMtxs = () => {
    return async (dispatch) => {
        const nem_address = getAddress(privateKey);    
        const nemTxList = await getTransactions(nem_address);
        console.log('nem')
        console.log(nemTxList)
        dispatch({
            type: NEM_TRANSACTIONS,
            payload: nemTxList
        })
    }
}