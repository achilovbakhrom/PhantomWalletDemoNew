import nem from '@coincrowd/react-native-nem-sdk';
// import nem2 from 'nem2-sdk';
// import nem from 'nem-sdk/src/model/';

it('nem address', () => {
    // const wallet = nem2.SimpleWallet.create('simple', 'password', nem2.NetworkType.MAIN_NET);
    // const addr = wallet.address
    // console.log(addr);
    const wallet = nem.model.wallet.createPRNG('wallet name', 'password', nem.model.network.data.mainnet.id)
    console.log(JSON.stringify(wallet));
    expect(20).toEqual(20);
})