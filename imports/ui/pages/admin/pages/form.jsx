import React, { Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";

class FormPage extends Component {
  static propTypes = {
    text     : PropTypes.string,
    url      : PropTypes.string,
    embed    : PropTypes.string,
    onChange : PropTypes.func,
  }

  @autobind
  onChange(o) {
    this.props.onChange && this.props.onChange({
      text  : this.props.text,
      url   : this.props.url,
      embed : this.props.embed,
      ...o
    });
  }

  render() {
    const { text, url, embed } = this.props;
    return (
      <div className="p-2 bg-white rounded">
        <InputGroup
          className="mt-1"
          value={url || ""}
          placeholder="URL..."
          text="URL"
          onChange={
            e => this.onChange({ url: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          value={embed || ""}
          placeholder="Embed URL..."
          text="Embed URL"
          onChange={
            e => this.onChange({ embed: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          richtext
          value={text || ""}
          placeholder="Text..."
          text="Text"
          onChange={
            value => this.onChange({ text: value })
          }
        />
      </div>
    );
  }
}

export default FormPage;