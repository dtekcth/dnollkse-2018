import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cx from "classnames";

class PrettyCheckbox extends Component {
  static propTypes = {
  }
  
  constructor(props) {
    super(props);
  }
  
  render() {
    const { props } = this;

    const properties = [
      "curve", "round",
      "outline", "fill", "slim", "thick",
      "switch",
      "icon", "svg", "image",
      "plain", "lock", "bigger",
    ];

    const cls = [];
    _.each(properties, c => {
      if (props[c]) cls.push("p-" + c);
    });

    if (props.animation) cls.push("p-" + props.animation);

    if (cls.length === 0) cls.push("p-default");

    const stateCls = [];
    if (props.color) stateCls.push("p-" + props.color);

    return (
      <div className={cx("pretty", !props.label && "labeless", cls, props.className)}>
        <input
          type="checkbox"
          name={props.name}
          id={props.id}
          disabled={props.disabled}
          checked={props.checked}
          onChange={props.onChange}
        />

        <div className={cx("state", stateCls, props.stateClassName)}>
          {props.iconComponent}

          <label>{props.label}</label>
        </div>
      </div>
    );
  }
}

export default PrettyCheckbox;