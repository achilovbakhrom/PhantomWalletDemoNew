import {combineReducers} from 'redux';
import mainReducer from './main/reducer';
import bitcoinReducer from './main/bitcoin.reducer';
import ethereumReducer from './main/ethereum.reduer';
import nemReducer from './main/nem.reduer';
import txReducer from './transactions/reducer';

const rootReducer = combineReducers({
    main:       mainReducer,
    bitcoin:    bitcoinReducer,
    ethereum:   ethereumReducer,
    nem:        nemReducer,
    tx:         txReducer
});

export default rootReducer;
