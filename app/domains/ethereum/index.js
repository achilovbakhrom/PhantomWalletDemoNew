import Web3 from 'web3';
import bip39 from 'react-native-bip39';
import bip32 from 'bip32';

import {
    pubToAddress, toChecksumAddress
} from 'ethereumjs-util';
import axios from 'axios';

const PATH = "m/0'"
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'));        

export const getEthBalance = async (address) => {
    
    return new Promise((res, rej) => {
        web3.eth.getBalance(address, function(error, balance){
            if (error) {
                rej(error)
            } else {
                res(balance);
            }            
        })
    })
};
        
export const generateXPubFromMnemonics = (mnemonics) => {
    const seed = bip39.mnemonicToSeed(mnemonics);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(PATH);
    console.log(toChecksumAddress(pubToAddress(child.publicKey, true).toString('hex')));

    return toChecksumAddress(pubToAddress(child.publicKey, true).toString('hex'));
}

export const generatePrivateKey = (mnemonics) => {
    const seed = bip39.mnemonicToSeed(mnemonics);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(PATH);
    return '0x'+ child.privateKey.toString('hex');
};

export const createAccount = () => web3.eth.accounts.create();

export const sendTransactionEth = async (from, toAddress, gas) => {
    console.log('send ether')
    const result = await web3.eth.sendTransaction({ from: from, to: toAddress, value: gas})
    console.log(result)
    return result;
};

export const getTransactionEth = async (address) => {  
    console.log('transaction eth');
    console.log(address);
    const url = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=asc';
    const txList = await axios.get(url);
    return txList;
}
