import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class Show extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address,
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestCount,
      approversCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "Manager can create requests to withdraw funds",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description: "Miniumum contribution required for this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestCount,
        meta: "Requests Count",
        description:
          "Number of open spending requests. Approvers need to vote to approve the requests",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Contributers",
        description:
          "Total number of people who have contributed for this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance),
        meta: "Balance (Eth)",
        description: "Current balance of the campaign",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={4}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default Show;
