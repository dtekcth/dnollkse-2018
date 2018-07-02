import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsContact extends Component {
  static propTypes = {
    contacts : PropTypes.object.isRequired,
    onChange : PropTypes.func,
  }

  static defaultProps = {
    contacts: {
      jour: "",
      irc: "",
      list: []
    }
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderContact({ value, onChange }) {
    return (
      <div className="flex -mx-1">
        <div className="w-1/2 px-1">
          <InputGroup
            value={value.name || ""}
            placeholder="Name..."
            text="Name"
            onChange={
              e => onChange && onChange({ name: e.target.value })
            }
          />
        </div>

        <div className="w-1/2 px-1">
          <InputGroup
            value={value.value || ""}
            placeholder="Value..."
            text="Value"
            onChange={
              e => onChange && onChange({ value: e.target.value })
            }
          />
        </div>
      </div>
    );
  }

  @autobind
  onChange(v) {
    this.props.onChange({
      ...this.props.contacts,
      ...v
    })
  }

  render() {
    const { props } = this;

    return (
      <F>
        <div className="bg-white rounded p-2">
          <InputGroup
            value={props.contacts.jour || ""}
            placeholder="Jour number..."
            text="Jour number"
            onChange={
              e => this.onChange({ jour: e.target.value })
            }
          />

          <InputGroup
            className="mt-1"
            value={props.contacts.irc || ""}
            placeholder="IRC channel..."
            text="IRC channel"
            onChange={
              e => this.onChange({ irc: e.target.value })
            }
          />
        </div>

        <div className="mt-2">
          <SortableDataList
            ref={e => this.list = e}
            items={props.contacts.list}
            onChange={list => this.onChange({ list })}
            renderItem={this.renderContact}
            placeholder="No contact info"
            model={{ name: "", value: "" }}
          />
        </div>
      </F>
    );
  }
}

export default SettingsContact;