import _ from "lodash";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import AdminLayout from "/imports/ui/layouts/admin";
import PrettyCheckbox from "/imports/ui/components/prettycheckbox";
import LetterAvatar from "/imports/ui/components/letteravatar";
import Dropdown from "/imports/ui/components/dropdown";
import IconButton from "/imports/ui/components/iconbutton";

import composeWithTracker from "/imports/helpers/composetracker";
import { userAssignRoleMethod, userUnassignRoleMethod } from "/imports/api/users";

let UserRoleTransition = (props) => (
  <CSSTransition
    {...props}
    classNames="role-anim"
    timeout={{ exit: 150, enter: 150 }}
  />
);

const mapStateToProps = (state) => {
  return {
    roles: state.roles
  };
};

@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("users.all", props.productId);
  
  if (handle.ready()) {
    const users = Meteor.users.find().fetch();
    
    onData(null, {
      users 
    });

    return;
  }
  
  onData(null, {});
})
@connect(mapStateToProps)
class AdminUsersPage extends Component {
  static propTypes = {
    users: PropTypes.array
  }

  state = {
    selected: []
  }

  @autobind
  handleSelectUser(index, checked) {
    const count = this.props.users.length;

    this.setState({
      selected: Object.assign([], this.state.selected, { [index]: checked })
    });
  }

  @autobind
  handleSelectAll(checked) {
    const count = this.props.users.length;

    this.setState({
      selected: _.fill(new Array(count), checked)
    });
  }

  @autobind
  handleDeleteRole(id) {
  }

  @autobind
  handleAssignRole(users, role) {
    _.each(users, u => {
      userAssignRoleMethod.call({ userId: u._id, role }, e => {
        if (e) {
          NotificationManager.error(e.reason);
        }
      });
    });
  }

  @autobind
  handleUnassignRole(users, role) {
    _.each(users, u => {
      userUnassignRoleMethod.call({ userId: u._id, role }, e => {
        if (e) {
          NotificationManager.error(e.reason);
        }
      });
    });
  }

  @autobind
  handleRevokeAllRoles(users) {
    _.each(users, u => {
      _.each(u.roles, r => {
        if (!r.assigned) return;

        userUnassignRoleMethod.call({ userId: u._id, role: r._id }, (e) => {});
      });
    });
  }

  @autobind
  handleRoleDropdownChanged(role) {
    this.setState({ selectedRole: role.value });
  }

  getUsersArray() {
    return _.sortBy(this.props.users || [], u => u.username);
  }

  getUsers() {
    const { props } = this;

    const sortedUsers = this.getUsersArray();
    return _.map(sortedUsers, (user, index) => {
      const userRoles = _.map(_.sortBy(user.roles, r => r._id), (r, i) => {
        if (!r.assigned) return;

        return (
          <UserRoleTransition key={r._id}>
            <span className="label uppercase bg-dtek text-white mr-1">
              {r._id}
            </span>
          </UserRoleTransition>
        );
      });

      return (
        <tr key={index}>
          <td className="p-2">
            <PrettyCheckbox
              checked={this.state.selected[index] || false}
              curve
              animation="rotate"
              color="dtek"
              onChange={e => this.handleSelectUser(index, e.target.checked)}
              icon
              iconComponent={
                <FontAwesomeIcon className="icon p-2px" icon="check" />
              }
            />
          </td>
          <td className="flex flex-row p-2 items-center">
            <LetterAvatar
              seed={user.username}
              letter={_.first(user.username)}
            />
            <span className="ml-1">
              {user.username}
            </span>
          </td>
          <td className="p-2">
            <TransitionGroup>
              {userRoles}
            </TransitionGroup>
          </td>
          <td className="p-2">
            <div className="flex justify-center">
              <IconButton icon="times" />
            </div>
          </td>
        </tr>
      );
    });

  }

  getRoles() {
    const { props } = this;

    const sortedRoles = _.sortBy(props.roles.list || [], r => r._id);
    return _.map(sortedRoles, (r, i) => {
      if (r.permission) return;

      return (
        <tr key={i}>
          <td className="px-2 py-2">
            <span className="label bg-dtek uppercase text-white">{r._id}</span>
          </td>
          <td className="px-2 py-1">
            <div className="flex justify-center">
              <IconButton
                icon="wrench"
                color="blue"
                size="sm"
                component={Link}
                to={`/admin/roles/${r._id}/manage`}
              />

              <IconButton
                icon="times"
                className="ml-1"
                onClick={
                  e => {
                    e.preventDefault();
                    this.handleDeleteRole(r._id);
                  }
                }
              />
            </div>
          </td>
        </tr>
      );
    });
  }

  render() {
    const { props } = this;

    const selectedCount = _.filter(this.state.selected).length;
    const users = this.getUsersArray();
    const selectedUsers = _.chain(this.state.selected)
                           .map((b, i) => b && users[i])
                           .filter()
                           .value();

    const allRoles = _.chain(props.roles.list)
                      .filter(r => !r.permission)
                      .map(r => r._id)
                      .value();

    return (
      <AdminLayout title="Users">
        <div className="p-4 flex -mx-1">
          <div className="w-3/5 px-1">
            <h2 className="ml-2">Users</h2>

            <div className="mt-2 p-2 rounded bg-white">
              <h4>Actions</h4>

              <div className="flex items-center mt-2">
                <div className="flex-grow">
                  <Dropdown
                    placeholder="Select a role..."
                    disabled={selectedCount === 0}
                    onChange={this.handleRoleDropdownChanged}
                    options={allRoles}
                  />
                </div>
                <div>
                  <button
                    onClick={
                      e =>
                        this.handleAssignRole(selectedUsers,
                                                this.state.selectedRole)
                    }
                    className={
                      cx("ml-2 transition-colors",
                         (selectedCount === 0 || !this.state.selectedRole) ?
                         "text-grey" : "link-dtek")
                    }
                    disabled={selectedCount === 0 || !this.state.selectedRole}
                  >
                    <FontAwesomeIcon icon="user-plus" />
                    <span className="ml-1">Assign role</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={
                      e =>
                        this.handleUnassignRole(selectedUsers,
                                                this.state.selectedRole)
                    }
                    className={
                      cx("mr-2 ml-1 transition-colors",
                         (selectedCount === 0 || !this.state.selectedRole) ?
                         "text-grey" : "link-dtek")
                    }
                    disabled={selectedCount === 0 || !this.state.selectedRole}
                  >
                    <FontAwesomeIcon icon="user-slash" />
                    <span className="ml-1">Unassign role</span>
                  </button>
                </div>
              </div>

              <button
                onClick={e => this.handleRevokeAllRoles(selectedUsers)}
                className={
                  cx("mt-2 transition-colors", selectedCount === 0 ? "text-grey" :
                     "link-dtek")
                }
                disabled={selectedCount === 0}
              >
                <FontAwesomeIcon icon="user-slash" />
                <span className="ml-1">Revoke all roles</span>
              </button>
            </div>

            <div className="mt-2 rounded bg-white">
              <table className="w-full table-reset table-auto">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-grey-lighter" align="left">
                      <PrettyCheckbox
                        curve
                        animation="rotate"
                        color="dtek"
                        onChange={e => this.handleSelectAll(e.target.checked)}
                        icon
                        iconComponent={
                          <FontAwesomeIcon className="icon p-2px" icon="check" />
                        }
                      />
                    </th>
                    <th className="pl-2 border-b border-grey-lighter" align="left">
                      Users
                    </th>
                    <th className="p-2 border-b border-grey-lighter w-full" align="left">
                      Roles
                    </th>
                    <th className="p-2 border-b border-grey-lighter" align="left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.getUsers()}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-2/5 px-1">
            <h2 className="ml-2">Roles</h2>

            <div className="mt-2 rounded bg-white">
              <table className="w-full table-reset table-auto">
                <thead>
                  <tr>
                    <th className="p-2 border-b border-grey-lighter w-full" align="left">
                      Roles
                    </th>
                    <th className="p-2 border-b border-grey-lighter" align="left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.getRoles()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminUsersPage;