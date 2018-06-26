import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import _ from "lodash";

class Loader extends Component {
  static propTypes = {
    classNames : PropTypes.object,
    size       : PropTypes.string,
    delay      : PropTypes.number,
    centered   : PropTypes.bool
  }

  static defaultProps = {
    classNames: {}
  }

  state = {
    visible: !this.props.delay
  }

  componentDidMount() {
    if (this.props.delay) {
      setTimeout(() => {
        if (this.unmounted) return;

        this.setState({ visible: true });
      }, this.props.delay);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { props } = this;

    if (!this.state.visible) {
      return (
        <div></div>
      );
    }

    return (
      <div
        className={
          cx(props.size ? "loader-" + props.size : "loader",
             props.centered && "centered",
             props.classNames.loader)
        }
      >
        <div className={cx("spinner spinner-dtek", props.classNames.spinner )}>
        </div>
      </div>
    )
  }
}

export default Loader;