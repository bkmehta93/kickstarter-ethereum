import React, { Component } from "react";
import { Button, Grid, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import web3 from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import { Router } from "../../../routes";

class RequestsIndex extends Component {
  state = {
    description: "",
    recepient: "",
    amount: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.amount, 'ether'),
          this.state.recepient
        )
        .send({
          from: accounts[0],
        });

      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  static async getInitialProps(props) {
    return {
      address: props.query.address,
    };
  }
  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h3>Create a Request</h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                  <label>Description</label>
                  <Input
                    placeholder="Enter Description"
                    value={this.state.description}
                    onChange={(event) =>
                      this.setState({ description: event.target.value })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Amount</label>
                  <Input
                    label="Eth"
                    labelPosition="right"
                    placeholder="Enter Amount"
                    value={this.state.amount}
                    onChange={(event) =>
                      this.setState({ amount: event.target.value })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Recepient</label>
                  <Input
                    placeholder="Enter Recepient Address"
                    value={this.state.recepient}
                    onChange={(event) =>
                      this.setState({ recepient: event.target.value })
                    }
                  />
                </Form.Field>
                <Button loading={this.state.loading} primary>
                  Create
                </Button>
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default RequestsIndex;
