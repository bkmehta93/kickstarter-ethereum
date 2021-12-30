import web3 from "./web3";
import compiledFactory from '../ethereum/build/CampaignFactory.json';
 
const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS;

const factory = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    ADDRESS
);

export default factory;