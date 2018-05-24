import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import autobind from "autobind-decorator";
import { connect } from "react-redux";
import {
  Route,
  Switch,
  withRouter
} from "react-router-dom";

import store from "/imports/store";

import composeWithTracker from "/imports/helpers/composetracker";

import HomePage from "/imports/ui/pages/home.jsx";
import LoginPage from "/imports/ui/pages/login.jsx";

@withRouter
/* @composeWithTracker((props, onData) => {
 *   const handle = Meteor.subscribe("products.id", props.productId);
 * 
 *   if (handle.ready()) {
 *     Meteor.users.find().count()
 * 
 *     onData(null, {
 *       product: product
 *     });
 *   }
 * 
 *   onData(null, {
 *     ready: product
 *   });
 * })*/
export default class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  @autobind
  handleLogout() {
    Meteor.logout(err => {
      this.props.history.push("/");
    });

    return null;
  }

  render() {
    return (
      <Provider store={store}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/logout" render={this.handleLogout} />
        </Switch>
      </Provider>
    );
  }
}

