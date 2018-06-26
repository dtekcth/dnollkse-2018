import React, { Fragment as F, Component } from "react";
import { Helmet } from "react-helmet";
import { NotificationContainer } from "react-notifications";
import { Route, Switch, withRouter } from "react-router-dom";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";

import MainLayout from "/imports/ui/layouts/main";

import CommitteePage from "/imports/ui/pages/committee";
import HomePage from "/imports/ui/pages/home";
import LoginPage from "/imports/ui/pages/login";
import TestPage from "/imports/ui/pages/test";
import EnvironmentPage from "/imports/ui/pages/environment";
import SetupPage from "/imports/ui/pages/setup";
import NotFoundPage from "/imports/ui/pages/notfound";

import AdminCommitteesPage from "/imports/ui/pages/admin/committees/list";
import AdminManageCommitteePage from "/imports/ui/pages/admin/committees/manage";
import AdminIndexPage from "/imports/ui/pages/admin/index";
import AdminSettingsPage from "/imports/ui/pages/admin/settings";
import AdminRolePage from "/imports/ui/pages/admin/role";
import AdminUsersPage from "/imports/ui/pages/admin/users";
import AdminUploadsPage from "/imports/ui/pages/admin/uploads/list";
import AdminUploadsManagePage from "/imports/ui/pages/admin/uploads/manage";

@withRouter
class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
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
      <F>
        <Helmet>
          <meta name="viewport" content="initial-scale=0.5, minimum-scale=0.5" />
          <meta name="theme-color" content="#FA6607" />

          <link rel="icon" href="/favicon.ico?v=4" />
        </Helmet>

        <Switch>
          <Route name="Home"        exact path="/" component={HomePage} />
          <Route name="Test"        exact path="/test" component={TestPage} />
          <Route name="Environment" exact path="/environment" component={EnvironmentPage} />
          <Route name="Committee"   exact path="/committee/:committee" component={CommitteePage} />
          <Route name="Setup"       exact path="/setup" component={SetupPage} />
          <Route name="Login"       exact path="/login" component={LoginPage} />
          <Route name="Logout"      exact path="/logout" render={this.handleLogout} />

          {/* Admin routes */}
          <Route name="Admin"               exact path="/admin" component={AdminIndexPage } />
          <Route name="Admin - Settings"    exact path="/admin/settings" component={AdminSettingsPage } />
          <Route name="Admin - Users"       exact path="/admin/users" component={AdminUsersPage } />
          <Route name="Admin - Uploads"     exact path="/admin/uploads" component={AdminUploadsPage } />
          <Route name="Admin - Manage Role" exact path="/admin/roles/:role/manage" component={AdminRolePage } />
          <Route
            exact path="/admin/uploads/new"
            render={props => <AdminUploadsManagePage new {...props} />}
          />
          <Route
            exact path="/admin/uploads/:uploadId"
            component={AdminUploadsManagePage }
          />


          <Route exact path="/admin/committees" component={AdminCommitteesPage } />
          <Route
            exact path="/admin/committees/new"
            render={props => <AdminManageCommitteePage new {...props} />}
          />
          <Route
            exact path="/admin/committees/:committeeId"
            component={AdminManageCommitteePage}
          />

          <Route
            render={
              props =>
                <MainLayout>
                  <NotFoundPage />
                </MainLayout>
            }
          />
        </Switch>

        <NotificationContainer />
      </F>
    );
  }
}

export default App;