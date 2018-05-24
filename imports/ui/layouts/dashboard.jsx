import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import autobind from "autobind-decorator";
import _ from "lodash";
import { connect } from "react-redux";
import cx from "classnames";
import velocity from "velocity-animate";

import MainLayout from "/imports/ui/layouts/main.jsx";

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

@withRouter
@connect(mapStateToProps)
export default class DashboardLayout extends Component {
  static propTypes = {
    className : PropTypes.string,
    content   : PropTypes.object,
    children  : PropTypes.node,
    location  : PropTypes.object.isRequired
  }

  @autobind
  handleLogout() {
    Meteor.logout(err => {
      this.props.history.push("/");
    });
  }

  componentDidMount(prevProps) {
    velocity(this.content, "stop");
    velocity.hook(this.content, "opacity", 0);
    velocity(this.content, { opacity: 1 }, { duration: 500 });
    
    /* if (prevProps.location != this.props.location) {
     *   console.log("loc change");
     * }*/
  }

  render() {
    const props = this.props;
    const user = props.user;

    let login;
    let userElement;
    if (!user.userId) {
      login = (
        <Link
          className={
            cx("tracking-wide",
               "font-bold text-base text-white"
            )
          }
          to="/login"
        >
          Login
        </Link>
      );
    }
    else if (!user.isLoading && !user.isLoggingIn && user.data) {
      userElement = (
        <div>
          <span
            className={
              cx("tracking-wide",
                 "text-base font-bold text-white"
              )
            }
          >
            {user.data.username}
          </span>

          <a
            className={
              cx("tracking-wide",
                 "font-bold text-base text-white",
                 "ml-3"
              )
            }
            href="#"
            onClick={this.handleLogout}
          >
            Logout
          </a>
        </div>
      );
    }

    return (
      <MainLayout className={cx("layout-dashboard", props.className)}>
        <div className="container mx-auto">
          <div className="content-wrapper rounded-sm bg-white shadow-md m-6">
            <header className="bg-black-shark rounded-t-sm border-b border-grey-darkest">
              <div>
                <nav className="flex justify-between items-center p-2">
                  <Link
                    className={
                      cx("uppercase tracking-wide",
                         "text-base font-bold text-white"
                      )
                    }
                    to="/"
                  >
                    Healthworks
                  </Link>

                  {login}
                  {userElement}
                </nav>
              </div>
            </header>

            <div className="content" ref={e => this.content = e}>
              {props.content || props.children}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

}