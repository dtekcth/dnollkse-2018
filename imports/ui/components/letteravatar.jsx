import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cx from "classnames";
import randomColor from "randomcolor";
import contrast from "contrast";

class LetterAvatar extends Component {
  static propTypes = {
  }
  
  constructor(props) {
    super(props);
  }
  
  render() {
    const { props } = this;

    const color = randomColor({
      seed: props.seed,
      format: "rgb"
    });
    const colorHex = randomColor({
      seed: props.seed
    });

    return (
      <div
        className={
          cx("inline-block align-middle text-white",
             "w-10 h-10 rounded-full relative", props.className)
        }
        style={{
          backgroundColor: props.color || color,
          color: props.textColor ||
                 contrast(props.color || colorHex) === "light" ?
                 "black" : "white"
        }}
      >
        <span className="block text-xl absolute-center uppercase">
          {props.letter}
        </span>
      </div>
    );
  }
}

export default LetterAvatar;