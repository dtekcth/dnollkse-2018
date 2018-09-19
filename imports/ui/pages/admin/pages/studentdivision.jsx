import React, { Component, Fragment as F } from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";
import SortableDataList from "/imports/ui/components/sortabledatalist";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";

@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("committees.all");
  
  if (handle.ready()) {
    const committees = Committees.find().fetch();

    onData(null, {
      committees
    });

    return;
  }
  
  onData(null, {});
})
class StudentDivisionPage extends Component {
  static propTypes = {
    committeeId : PropTypes.string
  }

  static defaultProps = {
    committees: []
  }

  @autobind
  onChange(o) {
    this.props.onChange && this.props.onChange({
      committeeId : this.props.committeeId,
      ...o
    });
  }

  @autobind
  renderDocument({ value, onChange }) {
    const options = _.map(this.props.committees, c => {
      return {
        value: c,
        key: c._id,
        label: c.name
      };
    });

    let committeeOpt = value.committeeId &&
                       _.find(options, c => c.value._id == value.committeeId);

    return (
      <F>
        <InputGroup
          text="Committee"
          value={committeeOpt}
          dropdown
          options={options}
          onChange={
            opt => onChange({ committeeId: opt.value._id })
          }
        />
      </F>
    );
  }

  render() {
    const { text, url, embed } = this.props;

    const options = _.map(this.props.committees, c => {
      return {
        value: c,
        key: c._id,
        label: c.name
      };
    });

    let committeeOpt = this.props.committeeId &&
                       _.find(options, c => c.value._id == this.props.committeeId);

    return (
      <F>
        <div className="p-2 bg-white rounded">
          <InputGroup
            text="Committee"
            value={committeeOpt}
            dropdown
            options={options}
            onChange={
              opt => this.onChange({ committeeId: opt.value._id })
            }
          />
        </div>

        <div className="mt-2">
          <h3 className="ml-2 mt-4 mb-1 text-grey-dark">Predecessors</h3>

          <SortableDataList
            ref={e => this.predecessorList = e}
            items={this.props.predecessors}
            onChange={items => this.onChange({ predecessors: items })}
            renderItem={this.renderDocument}
            placeholder="No items"
            model={{ committeeId: "" }}
          />

          <div className="flex justify-end mt-2">
            <button
              type="button"
              className={
                cx("py-1 px-2 rounded-full inline-block",
                   "bg-blue text-white hover:bg-blue-dark transition-colors")
              }
              onClick={e => this.predecessorList.addItem()}
            >
              <FontAwesomeIcon icon="plus" fixedWidth />
              <span className="ml-1">Add item</span>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="ml-2 mb-1 text-grey-dark">Other Committees</h3>

          <SortableDataList
            ref={e => this.otherList = e}
            items={this.props.others}
            onChange={items => this.onChange({ others: items })}
            renderItem={this.renderDocument}
            placeholder="No items"
            model={{ committeeId: "" }}
          />

          <div className="flex justify-end mt-2">
            <button
              type="button"
              className={
                cx("py-1 px-2 rounded-full inline-block",
                   "bg-blue text-white hover:bg-blue-dark transition-colors")
              }
              onClick={e => this.otherList.addItem()}
            >
              <FontAwesomeIcon icon="plus" fixedWidth />
              <span className="ml-1">Add item</span>
            </button>
          </div>
        </div>

      </F>
    );
  }
}

export default StudentDivisionPage;