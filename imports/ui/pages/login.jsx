import React, { Component } from "react";
import autobind from "autobind-decorator";
import { withRouter } from "react-router-dom";

import MainLayout from "/imports/ui/layouts/main.jsx";
import AuthorizedLayout from "/imports/ui/layouts/authorized.jsx";
import AutoForm from "/imports/ui/components/autoform.jsx";

@withRouter
export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  @autobind
  handleLogin(e, o) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    Meteor.loginWithPassword(o.username, o.password, err => {
      this.setState({
        loading: false
      });

      if (err) {
        this.props.history.push("/");
      }
    });
  }

  render() {
    return (
      <MainLayout>
        <AuthorizedLayout noLoad fail successRoute="/">
          <div className="flex justify-center">
            <div className="w-full max-w-xs mt-2">
              <AutoForm
                onSubmit={this.handleLogin}
                trimOnSubmit
                className="bg-white shadow-md rounded p-4"
              >
                <input
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-grey-darker mb-2"
                  id="username"
                  placeholder="Username"
                />

                <input
                  className="shadow appearance-none border rounded w-full py-1 px-2 text-grey-darker mb-2"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
                
                <div className="flex justify-center w-full">
                  <button className="button bg-blue py-1 px-2 rounded text-white" type="submit">
                    Login
                  </button>
                </div>
              </AutoForm>
            </div>
          </div>
        </AuthorizedLayout>
      </MainLayout>
    );
  }
}
