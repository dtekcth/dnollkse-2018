import React, { Fragment as F, Component } from "react";
import { Helmet } from "react-helmet";
import { NotificationContainer } from "react-notifications";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";

import MainLayout from "/imports/ui/layouts/main";

import DynamicPage from "/imports/ui/pages/dynamicpage";
import ContactsPage from "/imports/ui/pages/contacts";
import SchedulePage from "/imports/ui/pages/schedule";
import NewsPage from "/imports/ui/pages/news";
import LoginPage from "/imports/ui/pages/login";
import EnvironmentPage from "/imports/ui/pages/environment";
import SetupPage from "/imports/ui/pages/setup";
import NotFoundPage from "/imports/ui/pages/notfound";

import AdminCommitteesPage from "/imports/ui/pages/admin/committees/list";
import AdminManageCommitteePage from "/imports/ui/pages/admin/committees/manage";
import AdminIndexPage from "/imports/ui/pages/admin/index";
import AdminSettingsPage from "/imports/ui/pages/admin/settings/index.jsx";

import AdminPagesPage from "/imports/ui/pages/admin/pages/index.jsx";
import AdminManagePagePage from "/imports/ui/pages/admin/pages/manage.jsx";

import AdminNewsPage from "/imports/ui/pages/admin/news/index.jsx";
import AdminManagePostPage from "/imports/ui/pages/admin/news/manage.jsx";

import AdminRolePage from "/imports/ui/pages/admin/role";
import AdminUsersPage from "/imports/ui/pages/admin/users";

import AdminUploadsPage from "/imports/ui/pages/admin/uploads/list";
import AdminUploadsManagePage from "/imports/ui/pages/admin/uploads/manage";

function RouteWithLayout({layout, component, ...rest}){
  return (
    <Route {...rest} render={(props) =>
      React.createElement(layout, props, React.createElement(component, props))
    }/>
  );
}

const MainRoute = ({ component: Component, render, ...rest }) => {
  return (
    <Route {...rest} render={matchProps => (
      <F>
        {
          render ? render(matchProps) :
          <Component {...matchProps} />
        }
      </F>
    )} />
  )
};

const mapStateToProps = (state) => {
  return {
    pages: state.pages
  };
};

@withRouter
@connect(mapStateToProps)
class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      /* window.scrollTo(0, 0)*/
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
    const routes = _.map(this.props.pages.list, (p, i) =>
      <MainRoute
        key={i}
        exact path={p.url}
        render={props => <DynamicPage {...props} pageId={p._id} />}
      />
    );

    return (
      <F>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=0.5"
          />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="icon" href="/favicon.ico?v=6" />
          <link rel="manifest" href="/site.webmanifest">
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#FA6607" />

        </Helmet>

        <Switch>
          <MainRoute exact path="/environment" component={EnvironmentPage} />
          <MainRoute exact path="/setup" component={SetupPage} />

          {routes}

          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/logout" render={this.handleLogout} />

          {/* Admin routes */}
          <Route exact path="/admin" component={AdminIndexPage} />
          <Route exact path="/admin/settings" component={AdminSettingsPage} />
          <Route exact path="/admin/users" component={AdminUsersPage} />
          <Route exact path="/admin/uploads" component={AdminUploadsPage} />
          <Route exact path="/admin/roles/:role/manage" component={AdminRolePage} />
          <Route
            exact path="/admin/uploads/new"
            render={props => <AdminUploadsManagePage new {...props} />}
          />
          <Route
            exact path="/admin/uploads/:uploadId"
            component={AdminUploadsManagePage }
          />

          {/* Committees */}
          <Route exact path="/admin/committees" component={AdminCommitteesPage} />
          <Route
            exact path="/admin/committees/new"
            render={props => <AdminManageCommitteePage new {...props} />}
          />
          <Route
            exact path="/admin/committees/:committeeId"
            component={AdminManageCommitteePage}
          />

          {/* Pages */}
          <Route exact path="/admin/pages" component={AdminPagesPage} />
          <Route
            exact path="/admin/pages/new"
            render={props => <AdminManagePagePage new {...props} />}
          />
          <Route
            exact path="/admin/pages/:pageId"
            component={AdminManagePagePage}
          />

          {/* News */}
          <Route exact path="/admin/news" component={AdminNewsPage} />
          <Route
            exact path="/admin/news/new"
            render={props => <AdminManagePostPage new {...props} />}
          />
          <Route
            exact path="/admin/news/:postId"
            component={AdminManagePostPage}
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
