import {
    NEM_BALANCE_CALCUATED,
    NEM_TRANSACTION_FAILED,
    NEM_TRANSACTION_LIST_FAILED,
    NEM_TRANSACTION_LIST_SUCCESSFULL, 
    NEM_TRANSACTION_SUCCESSFULL,
    TxType
} from './constants';

const initialValue = {
    nemBalance: 0,
    nemTx: TxType.NONE,
    nemTxErrorText: '',
    nemTxListErrorText: '',
    nemTxList: ''
};

const nemReducer = (state = initialValue, action) => {
    switch(action.type) {
        case NEM_BALANCE_CALCUATED:
            return {...state, nemBalance: action.payload};
        case NEM_TRANSACTION_FAILED:
            return {...state, nemTx: TxType.TX_ERROR, nemTxErrorText: action.payload};
        case NEM_TRANSACTION_LIST_FAILED:
            return {...state, nemTxListErrorText: action.payload};
        case NEM_TRANSACTION_LIST_SUCCESSFULL:
            return {...state, nemTxList: action.payload};
        case NEM_TRANSACTION_SUCCESSFULL:
            return {...state, nemTx: TxType.TX_SUCCESS, nemTxErrorText: ''};
        default:
            return state;
    }
};

export default nemReducer;