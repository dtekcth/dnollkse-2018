import React, { Fragment as F, Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

class SettingsFAQ extends Component {
  static propTypes = {
    questions : PropTypes.array.isRequired,
    onChange  : PropTypes.func,
  }

  @autobind
  addItem(item) {
    this.list.addItem(item);
  }

  renderQuestion({ value, onChange }) {
    return (
      <F>
        <InputGroup
          value={value.question || ""}
          placeholder="Question..."
          text="Question"
          onChange={
            e => onChange && onChange({ question: e.target.value })
          }
        />

        <InputGroup
          className="mt-1"
          richtext
          value={value.answer || ""}
          placeholder="Answer..."
          text="Answer"
          onChange={
            value => onChange && onChange({ answer: value })
          }
        />
      </F>
    );
  }

  render() {
    return (
      <SortableDataList
        ref={e => this.list = e}
        items={this.props.questions}
        onChange={this.props.onChange}
        renderItem={this.renderQuestion}
        placeholder="No questions"
        model={{ question: "", answer: "" }}
      />
    );
  }
}

export default SettingsFAQ;