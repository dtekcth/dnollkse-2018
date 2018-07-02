import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsLinks extends Component {
  static propTypes = {
    links : PropTypes.array.isRequired,
    onChange  : PropTypes.func,
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderLink({ value, onChange }) {
    return (
      <F>
        <InputGroup
          value={value.title || ""}
          placeholder="Title..."
          text="Title"
          onChange={
            e => onChange && onChange({ title: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          value={value.link || ""}
          placeholder="Link..."
          text="Link"
          onChange={
            e => onChange && onChange({ link: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          richtext
          value={value.text || ""}
          placeholder="Text..."
          text="Text"
          onChange={
            value => onChange && onChange({ text: value })
          }
        />
      </F>
    );
  }

  render() {
    return (
      <SortableDataList
        ref={e => this.list = e}
        items={this.props.links}
        onChange={this.props.onChange}
        renderItem={this.renderLink}
        placeholder="No links"
        model={{ title: "", link: "", text: "" }}
      />
    );
  }
}

export default SettingsLinks;