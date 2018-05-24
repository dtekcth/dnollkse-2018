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
      <MainLayout className="login-page">
        <AuthorizedLayout noLoad fail successRoute="/">
          <div className="flex justify-center">
            <div className="w-full max-w-xs mt-2">
              <div className="login-box">
                <h5 className="uppercase block tracking-wide text-center text-white mb-1">Healthworks</h5>

                <AutoForm
                  onSubmit={this.handleLogin}
                  trimOnSubmit
                  className="bg-white rounded-sm p-4"
                >
                  <div className="bg-grey-lighter rounded-sm px-2 py-1">
                    <small className="uppercase text-xs text-grey">
                      Username
                    </small>
                    <input
                      className="appearance-none bg-transparent w-full text-sm text-grey-darker mt-1"
                      id="username"
                    />
                  </div>

                  <div className="bg-grey-lighter rounded-sm mt-1">
                    <input
                      className="appearance-none bg-transparent w-full py-1 px-2 text-grey-darker"
                      id="password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button
                    className="button bg-green py-1 px-2 rounded text-white w-full mt-1"
                    type="submit">
                    Login
                  </button>
                </AutoForm>
              </div>
            </div>
          </div>
        </AuthorizedLayout>
      </MainLayout>
    );
  }
}
