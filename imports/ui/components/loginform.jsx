import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";

import AutoForm from "/imports/ui/components/autoform";

import { userAuthenticateMethod } from "/imports/api/users";

class LoginForm extends Component {
  state = {
    loading: false,
    error: null
  }

  @autobind
  handleLogin(e, o) {
    e.preventDefault();

    const handler = setTimeout(() => {
      this.setState({
        loading: true
      });
    }, 500);

    userAuthenticateMethod.call({
      cid: o.username,
      password: o.password
    }, (err, res) => {
      clearTimeout(handler);

      if (err) {
        this.setState({
          loading: false,
          error: err.reason
        });

        return;
      };

      Meteor.loginWithToken(res.token, e => {
        if (e) return;

        this.props.onLogin && this.props.onLogin();
      });
    });
  }

  render() {
    let errorText;
    if (this.state.error) {
      errorText = (
        <div className="mx-2 mt-1">
          <div className="text-red tracking-wide text-center rounded p-1">
            {this.state.error}
          </div>
        </div>
      );
    }

    const content = (
      <F>
        <div className={
          cx("bg-grey-lighter rounded-sm px-2 py-1",
             this.state.loading && "loading")
        }>
          <small className="uppercase text-xs text-grey">
            CID
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
          className="button bg-dtek py-1 px-2 rounded text-white w-full mt-2 relative"
          type="submit"
        >
          <span className="tracking-wide text-lg">
            Login
          </span>
        </button>
      </F>
    );

    return (
      <F>
        <AutoForm
          onSubmit={this.handleLogin}
          trimOnSubmit
          className={
            cx(this.props.className, this.state.loading && "loading")
          }
        >
          {content}
        </AutoForm>

        {errorText}
      </F>
    );
  }
}

export default LoginForm;