require('dotenv').config()
const MNEMONIC = process.env.MNEMONIC;
const NETWORK_URL = process.env.NETWORK_URL;

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const campaignFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(
  MNEMONIC,
  NETWORK_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(campaignFactory.interface))
    .deploy({ data: campaignFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
