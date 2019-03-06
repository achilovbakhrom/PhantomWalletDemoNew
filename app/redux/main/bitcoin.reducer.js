import {
    BITCOIN_BALANCE_CALCUATED,
    BITCOIN_TRANSACTION_LIST_FAILED,
    BITCOIN_TRANSACTION_LIST_SUCCESSFULL,
    BITCOIN_TRANSACTION_SUCCESSFULL,
    BITCOIN_TRANSACTION_FAILED,
    TxType    
} from './constants';

const initialValue = {
    bitcoinBalance: 0,
    btcTxListErrorText: '',
    btcTxList: [],
    btcTx: TxType.NONE,
    btcTxErrorText: ''    
}

const bitcoinReducer = (state = initialValue, action) => {
    switch(action.type) {
        case BITCOIN_BALANCE_CALCUATED:
            return {...state, btcBalance: action.payload};
        case BITCOIN_TRANSACTION_LIST_FAILED:
            return {...state, btcTxListErrorText: action.payload};
        case BITCOIN_TRANSACTION_LIST_SUCCESSFULL:
            return {...state, btcTxList: action.payload};
        case BITCOIN_TRANSACTION_SUCCESSFULL:
            return {...state, btcTx: TxType.TX_SUCCESS, btcTxErrorText: action.payload};
        case BITCOIN_TRANSACTION_FAILED:
            return {...state, btcTx: TxType.TX_ERROR, btcTxErrorText: action.payload};
        default:
            return state;
    }
}

export default bitcoinReducer;