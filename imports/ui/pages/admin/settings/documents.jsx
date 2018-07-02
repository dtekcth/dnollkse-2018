import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsDocuments extends Component {
  static propTypes = {
    documents : PropTypes.array.isRequired,
    onChange  : PropTypes.func,
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderDocument({ value, onChange }) {
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
        items={this.props.documents}
        onChange={this.props.onChange}
        renderItem={this.renderDocument}
        placeholder="No documents"
        model={{ title: "", text: "" }}
      />
    );
  }
}

export default SettingsDocuments;