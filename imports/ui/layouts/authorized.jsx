import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Roles } from "meteor/alanning:roles";

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

@withRouter
@connect(mapStateToProps)
export default class AuthorizedLayout extends Component {
  static propTypes = {
    roles          : PropTypes.array,
    fail           : PropTypes.bool,
    noLoad         : PropTypes.bool,
    
    successRoute   : PropTypes.string,
    failureRoute   : PropTypes.string,
    loginRoute     : PropTypes.string,
    
    user           : PropTypes.object,
    
    content        : PropTypes.node,
    children       : PropTypes.node,
    loadingContent : PropTypes.node,
    failureContent : PropTypes.node
  }
  
  constructor() {
    super();
    
    this.state = {};
  }
  
  isAuthorized() {
    const { user } = this.props;
    const userId = user.userId;
    if (!userId) return false;
    
    if (this.props.roles && !Roles.userIsInRole(userId, this.props.roles))
      return false;
    
    return true;
  }
  
  checkAuthorization() {
    const props = this.props;
    const user = props.user;

    if (props.isLoggingIn || props.isLoading) return;
    
    if (!user.userId && props.loginRoute) {
      props.history.push(props.loginRoute);
    }
    else if (!this.isAuthorized()) {
      if (props.failureRoute)
        props.history.push(props.failureRoute);
    }
    else {
      if (props.successRoute)
        props.history.push(props.successRoute);
    }
  }
  
  handleBack() {
    history.back();
  }
  
  componentDidMount() {
    this.checkAuthorization();
  }
  
  componentDidUpdate() {
    this.checkAuthorization();
  }
  
  render() {
    const { user } = this.props;
    if ((user.isLoggingIn || user.isLoading) && !this.props.noLoad) {
      if (this.props.loadingContent)
        return this.props.loadingContent;
      
      return (
        <div className="loader centered">
          <div className="spinner"></div>
        </div>
      );
    }
    
    const isAuthorized = this.isAuthorized();
    if (!isAuthorized && !this.props.fail) {
      return this.props.failureContent || <div></div>;
    }
    
    return this.props.children || this.props.content;
  }
}
