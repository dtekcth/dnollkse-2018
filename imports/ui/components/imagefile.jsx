import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Loader from "/imports/ui/components/loader";

class ImageFile extends Component {
  static propTypes = {
    className  : PropTypes.string,
    src        : PropTypes.string,
    defaultSrc : PropTypes.string,
    alt        : PropTypes.string,
    loading    : PropTypes.bool,
    linked     : PropTypes.bool,
    noLoad     : PropTypes.bool,
  }

  render() {
    let src = this.props.src || this.props.defaultSrc;

    if (!this.props.noLoad && this.props.loading) {
      return (
        <div className={this.props.className}>
          <Loader delay={1000} />
        </div>
      );
    }
    else {
      if (!src)
        return (
          <div className={this.props.className}></div>
        );

      const img = (
        <img
          className={cx(this.props.className, this.props.imgClassName)}
          alt={this.props.alt}
          src={src}
        />
      );

      if (this.props.linked) {
        return (
          <a href={src}>
            {img}
          </a>
        );
      }

      return img;
    }
  }
}

export default ImageFile;