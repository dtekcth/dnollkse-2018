import React, { Component } from "react";
import cx from "classnames";
import marked from "marked";
import PropTypes from "prop-types";

class Markdown extends Component {
  static propTypes = {
    children  : PropTypes.string,
    className : PropTypes.string,
    sanitize  : PropTypes.bool,
    options   : PropTypes.object,
  }

  static defaultProps = {
    children : "",
    sanitize : false,
    options  : {}
  }

  render() {
    const { props } = this;

    const html = marked(props.children, {
      sanitize: props.sanitize,
      ...props.options
    });

    return (
      <div
        className={cx("markdown", props.className)}
        dangerouslySetInnerHTML={{
          __html: html
        }}
      ></div>
    );
  }
}

export default Markdown;