import {
    ETHEREUM_BALANCE_CALCUATED,
    ETHEREUM_TRANSACTION_FAILED,
    ETHEREUM_TRANSACTION_LIST_FAILED,
    ETHEREUM_TRANSACTION_LIST_SUCCESSFULL, 
    ETHEREUM_TRANSACTION_SUCCESSFULL,
    TxType
} from './constants';

const initialValue = {
    ethBalance: 0,
    ethTx: TxType.NONE,
    ethTxErrorText: '',
    ethTxListErrorText: '',
    ethTxList: ''
};

const ethereumReducer = (state = initialValue, action) => {
    switch(action.type) {
        case ETHEREUM_BALANCE_CALCUATED:
            return {...state, ethBalance: action.payload};
        case ETHEREUM_TRANSACTION_FAILED:
            return {...state, ethTx: TxType.TX_ERROR, ethTxErrorText: action.payload};
        case ETHEREUM_TRANSACTION_LIST_FAILED:
            return {...state, ethTxListErrorText: action.payload};
        case ETHEREUM_TRANSACTION_LIST_SUCCESSFULL:
            return {...state, ethTxList: action.payload};
        case ETHEREUM_TRANSACTION_SUCCESSFULL:
            return {...state, ethTx: TxType.TX_SUCCESS, ethTxErrorText: ''};
        default:
            return state;
    }
};

export default ethereumReducer;