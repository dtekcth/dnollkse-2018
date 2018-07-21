import React, { Component } from "react";
import { Link } from "react-router-dom";
import isExternal from "is-url-external";
import PropTypes from "prop-types";

class DynamicLink extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
  }

  render() {
    if (isExternal(this.props.to))
      return (
        <a
          href={this.props.to}
          {...this.props}
        />
      );

    return (
      <Link {...this.props} />
    );
  }
}

export default DynamicLink;