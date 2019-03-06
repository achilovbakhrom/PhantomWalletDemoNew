import {
    MNEMONICS_GENERATED,
    LOADING,
    FINISH_LOADING,
    MNEMONICS_VALIDATION,
    BTC_XPUB,
    ETH_XPUB,
    NEM_ADDRESS
} from './constants';


const initialState = {
    mnemonics: '',
    loading: false,
    isMnemonicsValid: true

}

const mainReducer = (state=initialState, action) => {
    switch(action.type) {
        case MNEMONICS_GENERATED:
            return {...state, mnemonics: action.payload};
        case MNEMONICS_VALIDATION:
            return {...state, isMnemonicsValid: action.payload};
        case LOADING:
            return {...state, loading: true};
        case FINISH_LOADING:
            return {...state, loading: false};
        case BTC_XPUB:
            return {...state, btc_xpub: action.payload};
        case ETH_XPUB:
            return {...state, eth_xpub: action.payload};  
        case NEM_ADDRESS:
            console.log(action)
            return {...state, nem_address: action.payload}          
        default: 
            return state
    }
}

export default mainReducer;
