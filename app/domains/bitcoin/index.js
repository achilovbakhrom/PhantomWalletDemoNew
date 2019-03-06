import bip39 from 'react-native-bip39';
import bitcoin from 'react-native-bitcoinjs-lib';
import EventEmitter from 'events';
import bnet from './network';
import { bitcoinDb } from '../../utils/database';
import Hasher from '../../utils/hashUtils';
import Wallet from  '../../domains/wallet';
import {getXPub} from '../../utils/walletUtils';
import Constants from './constants';
import { Exception } from 'handlebars';
import axios from 'axios';

// 'project nasty dose grunt ritual price gap prison degree agent satisfy across'

class BitcoinWallet extends EventEmitter {

    constructor(info) {        
        this.__name = info.name;
        this.__address == info.address;
        this.__password = info.password || undefined;
        this.__utxos = [];        
    }

    set utxos(value) {
        this.__utxos = value;
    }

    get utxos() {
        return this.__utxos;
    }

    async save() {
        const wallet = new Wallet({
            name: name,
            address: address,
            password: password,
            network: bnet.name,
            seed: Hasher.encrypt(seed, password)
        });
        const w = await bitcoinDb.insert(wallet);        
        return w;
    }    
    
}

export const getTransactionsList = async (xpub) => {           
    
    const zeroIndexAddresses = await generateAddressListForIndex(0, 0, xpub);
    const firstIndexAddresses = await generateAddressListForIndex(0, 1, xpub);
    const responseZero = await bnet.api.getTransactions(zeroIndexAddresses);
    const responseFirst = await bnet.api.getTransactions(firstIndexAddresses);
    
    const zeroTx = responseZero.data.txs;
    const firstTx = responseFirst.data.txs;

    const result = [];

    zeroTx.forEach(element => {
        const inputs = element.inputs.map(input => {
            let out = input.prev_out
            return {
                index: out.n,
                tx_index: out.tx_index,
                address: out.addr,
                spent: out.spent,
                value: out.value,
                type: out.type,
            }
        })
        const outputs = element.out.map(out => {
            return {
                index: out.n,
                tx_index: out.tx_index,
                address: out.addr,
                spent: out.spent,
                value: out.value,
                type: out.type,
            }
        })
        result.push({
            hash: element.hash,
            fee: element.fee | 0,
            balance: element.balance,
            inputs: inputs,
            outputs: outputs,
            result: element.result
        })    
    });
    
    firstTx.forEach(element => {
        const inputs = element.inputs.map(input => {
            let out = input.prev_out
            return {
                index: out.n,
                tx_index: out.tx_index,
                address: out.addr,
                spent: out.spent,
                value: out.value,
                type: out.type,
            }
        })
        const outputs = element.out.map(out => {
            return {
                index: out.n,
                tx_index: out.tx_index,
                address: out.addr,
                spent: out.spent,
                value: out.value,
                type: out.type,
            }
        })
        result.push({
            hash: element.hash,
            fee: element.fee | 0,
            balance: element.balance,
            inputs: inputs,
            outputs: outputs,
            result: element.result
        })   
    })

    return result
}

export {
    bnet
}

export const getBalanceForMnemonics = async (mnemonics) => {
    const xpub = getXPub(mnemonics, bnet.current, BitcoinWallet.Defaults.Path);          
    const balance =  await bnet.api.getBalance(xpub)        
    return balance/Constants.Bitcoin.Satoshis;
}

const generateAddressListForIndex = (from, derivedPathIndex, xpub) => {        
    const master = bitcoin.HDNode.fromBase58(xpub);
    let index = from;
    return new Promise( (res) => {
        const addresses = [];
        while(true) {
            const derived = master.derive(derivedPathIndex).derive(index);
            addresses.push(derived.getAddress())
            if (index === from + 99) {
                res(addresses)
                break
            }
            index++
        }
    })
}

const __hasTransaction = async (address) => {
    const tx = await bnet.api.getTransactions(address);
    return tx && tx.length > 0
};

const __generateAddressForReceivingRemain = async (xpub) => {
    let from = 0;
    
    while (true) {
        const list = await generateAddressListForIndex(from, 1, xpub);
        console.log(list);
        
        for (var i = 0; i < list.length; i++) {
            const addr = list[i];
            console.log('address ' + addr);
            const ht = await __hasTransaction(addr);
            console.log('ht ' + ht);
            if (!ht) {
                return addr
            }
        }
        from ++;
    }

}

// export const sendTransaction = () => {
//     bnet.api.getFee().then((fee) => {
//         console.log("fee="+fee);
//         const satoshis = Math.round(fee * Constants.Bitcoin.Satoshis);
//         let key = bitcoin.ECPair.fromWIF("L47iPTNUuNLPoHWKc42yaqE4fXag4Yi86KMvcbyb7TLJRm6ESSzD", bitcoin.networks.bitcoin);        
//         let tx = new bitcoin.TransactionBuilder();
//         tx.addInput("6584d44d8c205f3a33a5093fbb53f501a5a087344d6416b81e5ac74007bd22d1", 0);
//         tx.addOutput("17CrdRH4mWgCKwKJKYPU4CZrT89YfFEH2n", satoshis); // 1000 satoshis will be taken as fee.
//         tx.addOutput("16z46CESbJTEAFZdvm47w1rqzu4F7HQc8", Math.round(150000 - satoshis)); // 1000 satoshis will be taken as fee.
//         tx.sign(0, key);
//         console.log("before");
//         let raw = tx.build().toHex();
//         console.log(raw);
//         console.log("after");
//         bnet.api.broadcast(raw);
//     }).catch((e) => {
//         console.log('Could not get fee ', e);
//     });
// }

export const validateMnemonics = (mnemonics) => {
    return bip39.validateMnemonic(mnemonics)
}

// export const sendTransaction = async () => {
//     const fee = await bnet.api.getFee();
//     console.log("fee="+fee);
//     const satoshis = Math.round(Constants.Bitcoin.Satoshis);
//     let key = bitcoin.ECPair.fromWIF("KxxNPsd91jyk62A4ZEBVXvcMGcpdvPU7JfKXjdUBxLe3gqWt439u", bitcoin.networks.bitcoin);        
//     console.log(key);
//     let tx = new bitcoin.TransactionBuilder();
//     tx.addInput("87f062644e830dd51d957229b3804cbceacf609a8cb84f149e5b5948cc58d776", 0);        
//     tx.addOutput("17g8ZgE1JvXtkZ9De8RSmT4kvQWuuEBFcQ", parseInt(30000 - fee*satoshis))     
//     tx.addOutput("1PZMjF7DjunU1ib7c1Ci7CYCs2ZZhybuoV", parseInt(37697))
//     const signed = tx.sign(0, key)
//     console.log(signed);
//     console.log("before");
//     let raw = tx.build().toHex();
//     console.log(raw);
//     console.log("after");
//     try {
//         const response = await bnet.api.broadcast(raw);
//         console.log(response);
//     } catch(error) {
//         console.log(error)
//     }
    
// }

export const createWallet = (mnemonics, name, password) => {        
    const seed = bip39.mnemonicToSeed(mnemonics);                
    const master = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.bitcoin);
    const derived = master.derivePath(BitcoinWallet.Defaults.Path);                            
    const address = derived.getAddress();                
    
    return new Wallet({
        name: name,
        address: address,
        password: password,
        network: bnet.name,
        seed: Hasher.encrypt(seed, password),
        xpub: Hasher.encrypt(derived.neutered().toBase58(), password)
    });        
}

export const sendTransactionBTC = async (xpub, to, amount, mnemonics) => {   
    const fee = await bnet.api.getFee();
    const feeSatoshis = fee * Constants.Bitcoin.Satoshis; 
    const amountSatoshi = amount * Constants.Bitcoin.Satoshis;
    const balance =  await bnet.api.getBalance(xpub) * Constants.Bitcoin.Satoshis;       
    if (balance >= amountSatoshi + feeSatoshis && feeSatoshis + amountSatoshi > 600) {
        let utxos = await getUtxos(xpub);
        console.log(utxos);
        let minPosition = 0.0;
        let minDifference = Number.MAX_VALUE;
        let found = false;
        utxos.forEach((utxo, index) => {
            let innerValue = utxo.value;
            let diff = innerValue - amount;
            if (diff >= 0 && diff < minDifference) {
                minDifference = diff;
                minPosition = index;
                found = true;
            }
        });
        if (found) {
            let finalUtxo = utxos[minPosition];
            __sendTransaction([finalUtxo], amountSatoshi, fee, to, xpub, mnemonics)
        } else {
            let  sum = 0.0;
            let severalUtxos = [];
            utxos.forEach((utxo) => {                
                let innerValue = utxo.value;
                sum += innerValue;
                severalUtxos.push(utxo);
                if (sum > amountSatoshi + fee*Constants.Bitcoin.Satoshis) {
                    return;                  
                }
            });
            __sendTransaction(severalUtxos, amountSatoshi, fee, to, xpub, mnemonics)
        }
    } else {
        throw Exception('There is no money at address or amount less than 600 satoshi!')
    }    
};

const __normailzeDerivePath = (path) => {
    let result = path.toLowerCase();
    if (result.startsWith("m/0'")) {
        return result;
    } else if (result.startsWith("m/0")) {
        const left = result.substring(0, 3);
        const hardened = "'";
        const right = result.substring(3)
        return left + hardened + right;
    }
}

const __sendTransaction = async (utxoList, satoshis, fee, to, x_pub, mnemonics) => {
    
    const seed = bip39.mnemonicToSeed(mnemonics);                
    const master = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.bitcoin);
    const keyList = [];
    let tx = new bitcoin.TransactionBuilder();
    let sum = 0;
    utxoList.forEach((utxo) => {
        const {confirmations, script, tx_hash, tx_hash_big_endian, tx_index, tx_output_n, value, value_hex, xpub: {
            m, path
        }} = utxo;
        const derived = master.derivePath(__normailzeDerivePath(path));                            
        const wif = derived.keyPair.toWIF();
        let key = bitcoin.ECPair.fromWIF(wif);
        keyList.push(key);
        tx.addInput(tx_hash, tx_output_n);
        sum += value;
    })
    console.log('satoshi ' +satoshis);
    tx.addOutput(to, satoshis);
    console.log('sign');
    if (sum !== satoshis) {            
        const remain = sum - satoshis;
        const remainAddress = await __generateAddressForReceivingRemain(x_pub);
        console.log('remain = ' + remainAddress)
        tx.addOutput(remainAddress, Math.round(remain - satoshis*fee)); // 1000 satoshis will be taken as fee.
    }
    keyList.forEach((key, index) => {
        tx.sign(index, key);
    })
    
    console.log("before");
    let raw = tx.build().toHex();
    console.log(raw);
    console.log("after");
    // await bnet.api.broadcast(raw);

}

const __sendTransactionSingleUtxo = (x_pub, utxo, satoshis, to, mnemonics) => {
    bnet.api.getFee().then(async (fee) => {
        
        const {confirmations, script, tx_hash, tx_hash_big_endian, tx_index, tx_output_n, value, value_hex, xpub: {
            m, path
        }} = utxo;

        const seed = bip39.mnemonicToSeed(mnemonics);                
        const master = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.bitcoin);
        const derived = master.derivePath(__normailzeDerivePath(path));                            
        const address = derived.getAddress();                
        // console.log('xpub1 = ' + x_pub)
        // const master = bitcoin.HDNode.fromBase58(x_pub, bitcoin.networks.bitcoin);
        // console.log('master keypair');
        // console.log(master.keyPair);
        
        // const derived = master.derivePath('0/0');
        // console.log('derived keypair');
        // console.log(derived.keyPair);
        const wif = derived.keyPair.toWIF();

        // const wif = master.keyPair.toWIF();
        let key = bitcoin.ECPair.fromWIF(wif);
        console.log(wif);
        console.log(key.getAddress().toString()); //The above should output: 17hFoVScNKVDfDTT6vVhjYwvCu6iDEiXC4
        let tx = new bitcoin.TransactionBuilder();
        tx.addInput(tx_hash, tx_output_n);        
        console.log('satoshi ' +satoshis);
        tx.addOutput(to, satoshis); // 1000 satoshis will be taken as fee.
        console.log('sign');
        if (value !== satoshis) {            
            const remain = value - satoshis;
            const remainAddress = await __generateAddressForReceivingRemain(x_pub);
            console.log('remain = ' + remainAddress)
            tx.addOutput(remainAddress, Math.round(remain - satoshis*fee)); // 1000 satoshis will be taken as fee.
        }         
        
        tx.sign(0, key);
        console.log("before");
        let raw = tx.build().toHex();
        console.log(raw);
        console.log("after");

        // bnet.api.broadcast(raw);

    }).catch((e) => {
        console.log('Could not get fee ', e);
    });
};

const __sendTransactionListOfUtxo = (utxoList, satoshis, to, x_pub) => {
    bnet.api.getFee().then((fee) => {
        // const {confirmations, script, tx_hash, tx_hash_big_endian, tx_index, tx_output_n, value, value_hex, xpub: {
        //     m, path
        // }} = utxo;

        // const master = bitcoin.HDNode.fromBase58(x_pub, bitcoin.networks.bitcoin);
        // const derived = master.derivePath(path);                            
        // const wif = derived.keyPair.toWIF();
        // let key = bitcoin.ECPair.fromWIF(wif)
        // console.log(key.getAddress().toString()); //The above should output: 17hFoVScNKVDfDTT6vVhjYwvCu6iDEiXC4
        // let tx = new bitcoin.TransactionBuilder();
        // tx.addInput(tx_hash, tx_output_n);        
        // tx.addOutput(to, satoshis); // 1000 satoshis will be taken as fee.
        // if (value !== satoshis) {            
        //     const remain = value - satoshis
        //     tx.addOutput(__generateAddressForReceivingRemain(), Math.round(remain - satoshis*fee)); // 1000 satoshis will be taken as fee.
        // }         
        // tx.sign(0, key);
        // console.log("before");
        // let raw = tx.build().toHex();
        // console.log(raw);
        // console.log("after");
        // bnet.api.broadcast(raw);

    }).catch((e) => {
        console.log('Could not get fee ', e);
    });
};

export const getUtxos = (xpub) => {
    // 177xBhHZN3bGCH8c7GcVDv4gQ2bYGGvT3v
    return new Promise((res, rej) => {
        const url = 'https://blockchain.info/unspent?active=' + xpub        
        axios.get(url)
                .then(result => {
                    res(result.data.unspent_outputs)
                })
    })    
}

export const  usedAddressesList = async (xpub) => {
    const master = bitcoin.HDNode.fromBase58(xpub);
    let index = 0;    
    while(true) {
        const derived = master.derive(0).derive(index);
        // const derived = master.derivePath("0'")            
        const address = derived.getAddress();        
        if (index === 100) {
            break;
        }
        index++;
    }
}

BitcoinWallet.Defaults = {
    Encryption: 'aes-256-cbc',
    Path: "m/0'",
    DBFileName: 'wallets',
};

BitcoinWallet.Events = {
    Updated: 'updated',
};

export default BitcoinWallet;