import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsNavigation extends Component {
  static propTypes = {
    navigation : PropTypes.array.isRequired,
    onChange   : PropTypes.func,
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderNavLink({ value, onChange }) {
    return (
      <div className="flex -mx-1">
        <div className="w-1/2 px-1">
          <InputGroup
            value={value.text || ""}
            placeholder="Text..."
            text="Text"
            onChange={
              e => onChange && onChange({ text: e.target.value })
            }
          />
        </div>

        <div className="w-1/2 px-1">
          <InputGroup
            value={value.link || ""}
            placeholder="Link..."
            text="Link"
            onChange={
              e => onChange && onChange({ link: e.target.value })
            }
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <SortableDataList
        ref={e => this.list = e}
        items={this.props.navigation}
        onChange={this.props.onChange}
        renderItem={this.renderNavLink}
        placeholder="No navlinks"
        model={{ text: "", link: "" }}
      />
    );
  }
}

export default SettingsNavigation;