import {
    BTC_TRANSACTIONS, 
    ETH_TRANSACTIONS,
    NEM_TRANSACTIONS
} from './constants';


initialState = {
    btcTxList: [],
    ethTxList: [],
    nemTxList: []
}

const txReducer = (state = initialState, action) => {
    switch(action.type) {
        case BTC_TRANSACTIONS:
        console.log(BTC_TRANSACTIONS)
            return {...state, btcTxList: action.payload}
        case ETH_TRANSACTIONS:
            console.log(ETH_TRANSACTIONS)
            console.log(action.payload)
            return {...state, ethTxList: action.payload}
        case NEM_TRANSACTIONS:
            console.log(NEM_TRANSACTIONS)
            return {...state, nemTxList: action.payload}
        default: 
            return state;
    }
};

export default txReducer;