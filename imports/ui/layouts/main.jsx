import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default class MainLayout extends Component {
  static propTypes = {
    className : PropTypes.string,
    content   : PropTypes.object,
    children  : PropTypes.node,
  }

  render() {
    const props = this.props;

    return (
      <div className={cx("layout-main", props.className)}>
        <div className="wrapper" ref={node => this.content = node}>
          {props.content || props.children}
        </div>
      </div>
    );
  }

}
