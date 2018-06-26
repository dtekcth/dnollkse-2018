import React, { Fragment as F, Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import cx from "classnames";
import PropTypes from "prop-types";

import Loader from "/imports/ui/components/loader";
import DocumentTitle from "/imports/ui/components/documenttitle";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@connect(mapStateToProps)
class BaseLayout extends Component {
  static propTypes = {
    content   : PropTypes.object,
    children  : PropTypes.node
  }

  render() {
    const { props } = this;
    const { settings } = props;

    if (!settings.ready) {
      return (
        <div className="flex justify-center m-4">
          <Loader delay={1000} size="xl" />
        </div>
      );
    }
    else {
      if (!settings.data.setup) {
        return (
          <Redirect to="/setup" />
        );
      }
    }

    return (
      <F>
        {
          props.title &&
          <DocumentTitle title={props.title} />
        }

        <div className={props.className}>
          {props.content || props.children}
        </div>
      </F>
    );
  }
}

export default BaseLayout;