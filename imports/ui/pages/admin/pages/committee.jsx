import React, { Component } from "react";
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import InputGroup from "/imports/ui/components/inputgroup";

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
class CommitteePage extends Component {
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
    );
  }
}

export default CommitteePage;