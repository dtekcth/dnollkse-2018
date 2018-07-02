import _ from "lodash";
import React, { Component } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";

class IconButton extends Component {
  static propTypes = {
    icon      : PropTypes.string.isRequired,
    type      : PropTypes.string,
    size      : PropTypes.string,
    className : PropTypes.string,
    component : PropTypes.func,
  }

  render() {
    const { props } = this;

    const Comp = props.component || "button";
    const p = _.omit(props, ["type", "component", "className", "icon", "size"]);

    return (
      <Comp
        type={Comp == "button" ? props.type || "button" : props.type}
        className={
          cx("inline-flex justify-center items-center",
             "w-6 h-6 rounded-full transition-colors bg-transparent",
             `hover:bg-${props.color || "red"}`,
             `text-${props.color || "red"}`,
             `hover:text-${props.textColor || "white"}`, props.className)
        }
        {...p}
      >
        <FontAwesomeIcon icon={props.icon} fixedWidth size={props.size || "xs"} />
      </Comp>
    );
  }
}

export default IconButton;