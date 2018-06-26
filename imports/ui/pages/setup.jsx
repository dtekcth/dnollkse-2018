import React, { Fragment as F, Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cx from "classnames";
import { compose } from "react-komposer";

import LoginForm from "/imports/ui/components/loginform";
import DocumentTitle from "/imports/ui/components/documenttitle";

import {
  Settings,
  settingsSetupMethod
} from "/imports/api/settings";
import composeWithTracker from "/imports/helpers/composetracker";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    settings: state.settings
  };
};
@connect(mapStateToProps)
@compose((props, onData) => {
  if (!props.settings.ready) return;

  onData(null, {});
})
class SetupPage extends Component {
  state = {
    login: false
  }

  componentDidMount(prevProps) {
    if (this.props.settings.data.setup) {
      this.props.history.push("/");
    }
  }

  renderLogin() {
    return (
      <F>
        <h3>Let's start off by logging in!</h3>
        <button
          className={
            cx("block bg-dtek py-1 px-2 rounded",
               "text-white w-full mt-2 relative text-center")
          }
          onClick={() => this.setState({ login: true })}
        >
          <span className="tracking-wide text-lg">
            Login
          </span>
        </button>
      </F>
    );
  }

  render() {
    const { props } = this;
    const { user } = props;

    let content;

    if (this.state.login) {
      content = (
        <LoginForm
          onLogin={
            e => {
              settingsSetupMethod.call({});
              this.setState({ login: false });
            }
          }
        />
      );
    }
    else if (!user.isLoggingIn && !user.isLoading && !user.userId) {
      content = this.renderLogin();
    }
    else {
      content = (
        <F>
          <h3 className="text-center">
            Great! That's all!
          </h3>
          <Link
            to="/admin"
            className={
              cx("block bg-dtek py-1 px-2 rounded",
                 "text-white w-full mt-2 relative text-center")
            }
          >
            <span className="tracking-wide text-lg">
              Go to admin panel
            </span>
          </Link>
        </F>
      );
    }

    return (
      <F>
        <DocumentTitle title="Setup" />

        <div className="bg-grey-lighter h-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-xs mt-2">
              <div className="absolute-center">
                <h1 className="uppercase block tracking-wide text-center text-dtek font-geomancy mb-2">
                  DNollK
                </h1>

                <div className="bg-white shadow rounded-sm p-4 relative loginbox">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </F>
    );
  }
}

export default SetupPage;