import React, { Component } from "react";
import { Button, Grid, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestsIndex extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return {
      address: props.query.address,
      requestsCount,
      requests,
      approversCount,
    };
  }

  renderRows = () => {
    const rows = this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });

    return rows;
  };

  render() {
    const { Header, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h3>Requests</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests/new`}>
                <a>
                  <Button primary floated="right">
                    New Request
                  </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Table>
                <Header>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                  <HeaderCell>Amount</HeaderCell>
                  <HeaderCell>Recepient</HeaderCell>
                  <HeaderCell>Approval Count</HeaderCell>
                  <HeaderCell>Approvers</HeaderCell>
                  <HeaderCell>Finalize</HeaderCell>
                </Header>
                <Body>{this.renderRows()}</Body>
              </Table>
              <h5>{`Total Requests: ${this.props.requestsCount}`}</h5>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default RequestsIndex;
