import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import autobind from "autobind-decorator";
import _ from "lodash";
import { connect } from "react-redux";
import cx from "classnames";

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

@withRouter
@connect(mapStateToProps)
export default class MainLayout extends Component {
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
      <div className={props.className}>
        <header className="bg-black-shark border-b border-grey-darkest">
          <div>
            <nav
              className={
                cx("flex justify-between items-center",
                   "px-3 pt-2 pb-4 lg:py-1 lg:mx-6"
                )
              }
            >
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

        <div className="content" ref={node => this.content = node}>
          <div className="content-wrapper">
            {props.content || props.children}
          </div>
        </div>
      </div>
    );
  }

}
