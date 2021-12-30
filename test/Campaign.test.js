const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compliedFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compliedFactory.interface))
    .deploy({ data: compliedFactory.bytecode })
    .send({
      from: accounts[0],
      gas: "1000000",
    });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaign", () => {
  it("Deploys Campaign and Factory", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Marks Campaign creator as Manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Lets users to contribute to a campaign and adds them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert(isApprover);
  });

  it("Requires minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "5",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Allows to create a request", async () => {
    await campaign.methods
      .createRequest("Buying Batteries", 200, accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const newRequest = await campaign.methods.requests(0).call();
    assert.equal("Buying Batteries", newRequest.description);
  });
});
