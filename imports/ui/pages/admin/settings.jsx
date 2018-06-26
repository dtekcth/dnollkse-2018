import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";

import AdminLayout from "/imports/ui/layouts/admin";
import AutoForm from "/imports/ui/components/autoform";
import InputGroup from "/imports/ui/components/inputgroup";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";
import { Settings, settingsUpdateMethod } from "/imports/api/settings";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@withRouter
@connect(mapStateToProps)
@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("committees.all");
  
  if (handle.ready()) {
    const committees = Committees.find().fetch();

    onData(null, {
      committees,
      ready: props.settings.ready
    });

    return;
  }
  
  onData(null, {
    ready: false
  });
})
class AdminSettingsPage extends Component {
  static propTypes = {
  }

  static defaultProps = {
    committees: [],
    settings: {}
  }

  state = {}

  componentDidUpdate(prevProps) {
    if (this.props.ready && !prevProps.ready) {
      this.setState({
        committee: this.props.settings.data.committee
      });
    }
  }

  @autobind
  handleSave(e) {
    e.preventDefault();

    settingsUpdateMethod.call({ committee: this.state.committee });
  }

  render() {
    const options = _.map(this.props.committees, c => {
      return {
        value: c,
        key: c._id,
        label: c.name
      };
    });

    let committeeOpt = this.state.committee &&
                       _.find(options, c => c.value._id == this.state.committee);

    return (
      <AdminLayout title="Settings">
        <div className="p-4">
          <h2 className="ml-2">Settings</h2>

          <AutoForm
            onSubmit={this.handleSave}
            trimOnSubmit
          >
            <div className="mt-2 p-2 rounded bg-white">
              <InputGroup
                text="Committee"
                value={committeeOpt}
                dropdown
                options={options}
                onChange={
                  opt => this.setState({ committee: opt.value._id })
                }
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-green text-white hover:bg-green-dark transition-colors")
                }
              >
                <FontAwesomeIcon icon="check" fixedWidth />
                <span className="ml-1">Save</span>
              </button>
            </div>
          </AutoForm>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminSettingsPage;