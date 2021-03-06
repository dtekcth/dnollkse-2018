import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import IconButton from "/imports/ui/components/iconbutton"
import AdminLayout from "/imports/ui/layouts/admin";
import { ConfirmationPopup } from "/imports/ui/components/popup";

import composeWithTracker from "/imports/helpers/composetracker";

import { Committees, committeeRemoveMethod } from "/imports/api/committees";

let CommitteeTransition = (props) => (
  <CSSTransition
    {...props}
    classNames="role-anim"
    timeout={{ exit: 150, enter: 150 }}
  />
);

@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("committees.all");
  
  if (handle.ready()) {
    const committees = Committees.find().fetch();

    onData(null, {
      committees,
      ready: true
    });

    return;
  }
  
  onData(null, {});
})
class AdminCommitteesPage extends Component {
  static propTypes = {
    committees: PropTypes.array
  }

  static defaultProps = {
    committees: []
  }

  @autobind
  handleRemove(c) {
    committeeRemoveMethod.call({ committeeId: c._id });
  }

  getCommittees() {
    const { committees } = this.props;

    if (committees.length === 0) {
      return (
        <CommitteeTransition key="_">
          <li className="text-grey p-2">
            No committees
          </li>
        </CommitteeTransition>
      );
    }

    return _.chain(committees)
            .sortBy(c => c.name)
            .reverse()
            .map((c, index) => {
              let deletePopup;

              return (
                <CommitteeTransition key={c._id}>
                  <li className="p-2 text-grey-darkest">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/admin/committees/${c._id}`}
                          className="link-dtek"
                        >
                          <FontAwesomeIcon icon="users" fixedWidth />
                          <span className="ml-1">{c.name}</span>
                        </Link>
                      </div>

                      <ConfirmationPopup
                        ref={elem => deletePopup = elem}
                        position="left top"
                        trigger={
                          <IconButton
                            icon="times"
                            onClick={() => deletePopup.toggle()}
                          />
                        }
                        text="This cannot be undone"
                        onConfirm={() => this.handleRemove(c)}
                      />
                    </div>
                  </li>
                </CommitteeTransition>
              );
            })
            .value();
  }

  render() {
    const props = this.props;

    return (
      <AdminLayout title="Committees">
        <div className="p-4">
          <div className="px-1">
            <div className="flex justify-between px-2">
              <h2 className="ml-2">Committees</h2>

              <Link
                to="/admin/committees/new"
                className={
                  cx("button py-1 px-2 rounded-full inline-block",
                     "bg-green text-white hover:bg-green-dark transition-colors")
                }
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add new committee</span>
              </Link>
            </div>

            <div className="mt-2 rounded bg-white">
              <ul className="list-reset mt-1">
                <li className="p-2 border-b border-grey-lighter">
                  <span>Committees</span>
                </li>

                <TransitionGroup>
                  {props.ready && this.getCommittees()}
                </TransitionGroup>
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminCommitteesPage;