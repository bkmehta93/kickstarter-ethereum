import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import {Router} from "../routes";

class ContributeForm extends Component {
  state = {
    contribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution)
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Enter your Contribution</label>
          <Input
            label="Eth"
            labelPosition="right"
            placeholder="Enter value for your Contribution"
            value={this.state.contribution}
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>
        <Button loading={this.state.loading} primary>
          Contribute!!
        </Button>
        <Message error header="Oops!" content={this.state.errorMessage} />
      </Form>
    );
  }
}

export default ContributeForm;
