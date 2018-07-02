import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsContact extends Component {
  static propTypes = {
    contacts : PropTypes.array.isRequired,
    onChange : PropTypes.func,
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderContact({ value, onChange }) {
    return (
      <F>
        <InputGroup
          value={value.name || ""}
          placeholder="Name..."
          text="Name"
          onChange={
            e => onChange && onChange({ name: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          value={value.value || ""}
          placeholder="Value..."
          text="Value"
          onChange={
            e => onChange && onChange({ value: e.target.value })
          }
        />
      </F>
    );
  }

  render() {
    return (
      <SortableDataList
        ref={e => this.list = e}
        items={this.props.contacts}
        onChange={this.props.onChange}
        renderItem={this.renderContact}
        placeholder="No contact info"
        model={{ name: "", value: "" }}
      />
    );
  }
}

export default SettingsContact;