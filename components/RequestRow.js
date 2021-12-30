import React, { Component } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  state = {
    loading: false,
    loadingFinalize: false,
    message: "",
  };

  onApprove = async () => {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, message: "" });
    try {
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
      this.setState({ loading: false, message: "" });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ loading: false, message: err });
      console.log(err);
    }
  };

  onFinalize = async () => {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    this.setState({ loadingFinalize: true, message: "" });
    try {
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });
      this.setState({ loadingFinalize: false, message: "" });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ loadingFinalize: false, message: err });
      console.log(err);
    }
  };

  render() {
    const id = this.props.id;
    const request = this.props.request;
    const approversCount = this.props.approversCount;
    const { Row, Cell } = Table;
    const readyToFinalise = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalise & !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {!request.complete ? (
            <Button
              color="green"
              basic
              onClick={this.onApprove}
              loading={this.state.loading}
            >
              Approve
            </Button>
          ) : null}
        </Cell>
        <Cell>
          {!request.complete ? (
            <Button
              color="teal"
              basic
              onClick={this.onFinalize}
              loading={this.state.loadingFinalize}
            >
              Finalize
            </Button>
          ) : null}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
