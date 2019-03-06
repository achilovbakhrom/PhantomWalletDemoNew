import nem2 from '@coincrowd/react-native-nem-sdk';
import nem from 'nem-sdk';
import axios from 'axios';

export const privateKey = '6636343630323937343733373136653630323437333635366136663632373037';

export const getNEMBalance = async (address) => {    
    nem2.setEndpoint('http://san.nem.ninja', '7890')
    const balance = await nem2.getBalance(address);
    return balance;
}

export const getTransactions = async (address) => {
    const txs = await nem2.getTransactions(address);
    return txs;
}

export const getAddress = (privKey) => {
    nem2.setEndpoint('http://san.nem.ninja', '7890')
    nem2.setPrivateKey(privKey);
    return nem2.getAddress(104)
}



// export const sendTransactionNEM = (privKey, destinationAddress, amount, message) => {
//     return new Promise((res, rej) => {
//         // Create an object with parameters
//         var transferTransaction = nem.model2.objects.create("transferTransaction")(destinationAddress, amount, message);

//         // Prepare the above object
//         var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id)

//         nem.model.transactions.send(common, transactionEntity, endpoint).then(function(result) {
//             console.log(result)
//         });
//         // nem.setEndpoint('http://hugealice3.nem.ninja');
//         // nem.setPrivateKey(privKey);    
//         // try {
//         //     nem2.model.network
//         //     console.log('before');
//         //     nem.send(destinationAddress, amount, message, 104, (response) => {
//         //         console.log(response)
//         //         res(response);
//         //     }, (error) => {
//         //         console.log(error);    
//         //     });
//         //     console.log('after');
//         // } catch(error) {        
//         //     console.log(error);
//         // }
//     })
    
// }


export const sendTransactionNEM = (privateKey, recipient, amount, message) => {

    var rBytes = nem.crypto.nacl.randomBytes(32);
    var rHex = nem.utils.convert.ua2hex(rBytes);
    console.log("enter")
    var keyPair = nem.crypto.keyPair.create(rHex);
    console.log("addr")
    recipient = nem.model.address.toAddress(keyPair.publicKey.toString(),  nem.model.network.data.testnet.id)
    privateKey = nem.crypto.helpers.derivePassSha("passphrase", 6000).priv;
    var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
    var transferTransaction = nem.model.objects.get("transferTransaction");
    var common = nem.model.objects.get("common");
    common.privateKey = privateKey
    transferTransaction.amount = nem.utils.helpers.cleanTextAmount(amount);
    // Recipient address must be clean (no hypens: "-")
    transferTransaction.recipient = nem.model.address.clean(recipient);
    // Set message
    transferTransaction.message = message;
    var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
    // Serialize transfer transaction and announce
    nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
        // If code >= 2, it's an error
        console.log(res);
        if (res.code >= 2) {
            alert(res.message);
        } else {
            alert(res.message);
        }
    }, function(err) {
        console.log('logg')
        console.log(err);
        alert(err);
    });

}