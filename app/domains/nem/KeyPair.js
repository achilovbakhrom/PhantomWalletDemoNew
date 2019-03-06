import utils from '@coincrowd/react-native-nem-sdk/dist/utils';
import nacl from '@coincrowd/react-native-nem-sdk/dist/nacl-fast';

class KeyPair {
    constructor(privKey) {
        this.publicKey = new utils.BinaryKey(new Uint8Array(nacl.lowlevel.crypto_sign_PUBLICKEYBYTES));
        this.secretKey = utils.hex2ua_reversed(privKey);
        nacl.lowlevel.crypto_sign_keypair_hash(this.publicKey, this.secretKey, utils.hashfunc);
    }

    sign(data){
        let sig = new Uint8Array(64);
        let hasher = new utils.Hashobj()
        let r = nacl.lowlevel.crypto_sign_hash(sig, this, data, hasher);
        if (!r) {
            alert("Couldn't sign the tx, generated invalid signature");
            throw new Error("Couldn't sign the tx, generated invalid signature");
        }
        return new utils.BinaryKey(sig);
    }

}



export default KeyPair;