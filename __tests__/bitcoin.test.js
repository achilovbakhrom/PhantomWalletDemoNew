import bip39 from 'react-native-bip39';
import bitcoin from 'react-native-bitcoinjs-lib';


it('bitcoin', () => {
    const mnemonics = 'project nasty dose grunt ritual price gap prison degree agent satisfy across';
    const seed = bip39.mnemonicToSeed(mnemonics);                
    const master = bitcoin.HDNode.fromSeedBuffer(seed, bnet.current);
    master.keyPair.toWif
    const derived = master.derivePath(BitcoinWallet.Defaults.Path);                            
    const address = derived.getAddress();                
    
    console.log(address);
    console.log(derived.toBase58());

})