import _ from "lodash";
import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { Redirect, withRouter, Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import Dropdown from "/imports/ui/components/dropdown";
import Loader from "/imports/ui/components/loader";
import AdminLayout from "/imports/ui/layouts/admin";
import IconButton from "/imports/ui/components/iconbutton";

import composeWithTracker from "/imports/helpers/composetracker";
import {
  addRolesToParentMethod,
  removeRolesFromParentMethod
} from "/imports/api/users";

let PermissionTransition = (props) => (
  <CSSTransition
    {...props}
    classNames="role-anim"
    timeout={{ exit: 150, enter: 150 }}
  />
);

const mapStateToProps = (state, props) => {
  const { role } = props.match.params;
  const roleObj = _.find(state.roles.list, r => !r.permission && r._id == role);

  return {
    role: roleObj,
    roles: state.roles,
    ready: state.roles.ready
  };
};

@withRouter
@connect(mapStateToProps)
class AdminRolePage extends Component {
  static propTypes = {
  }

  componentDidUpdate() {
    const { props } = this;

    if (!props.role && props.ready)
      return props.history.goBack();
  }

  getInheritedPermissions() {
    const { props } = this;

    const inheritedPerms = {};
    let count = 0;
    const func = (role) => {
      if (role == null) return;
      if (role.permission) return;

      _.each(role.children, r => {
        const childRole = _.find(props.roles.list, o => o._id == r._id);
        if (role._id != props.role._id &&
            childRole.permission &&
            !_.includes(inheritedPerms[role._id] || [], r._id)) {

          inheritedPerms[role._id] = inheritedPerms[role._id] || [];
          inheritedPerms[role._id].push(r._id);
          count++;
        }

        func(childRole);
      });
    };

    func(props.role);

    if (count === 0) {
      return (
        <li className="p-2 text-grey">
          No inherited permissions
        </li>
      );
    }

    const items = [];
    const sorted = _.chain(inheritedPerms)
                    .map((perms, key) => key)
                    .sortBy()
                    .value();

    _.each(sorted, key => {
      const perms = inheritedPerms[key];

      items.push(
        <li key={items.length} className="p-2">
          <Link to={`/admin/roles/${key}/manage`} className="link-dtek">
            <FontAwesomeIcon icon="link" fixedWidth />
            <span className="ml-1">
              {key}
            </span>
          </Link>
        </li>
      );

      _.each(_.sortBy(perms), p => {
        items.push(
          <li key={items.length} className="p-2 text-grey-dark">
            <FontAwesomeIcon className="ml-2" icon="key" fixedWidth />
            <span className="ml-1">
              {p}
            </span>
          </li>
        );
      })
    });

    return items;
  }

  getPermissions() {
    const { props } = this;

    const allPerms = _.chain(props.roles.list)
                      .filter(r => r.permission)
                      .map(r => r._id)
                      .value();

    const perms = _.chain(props.role.children)
                   .filter(r => _.includes(allPerms, r._id))
                   .map(r => r._id)
                   .sortBy()
                   .value();

    if (perms.length === 0) {
      return (
        <PermissionTransition key="_">
          <li className="p-2 text-grey">
            No permissions
          </li>
        </PermissionTransition>
      );
    }

    return _.map(perms, (id) => {
      return (
        <PermissionTransition key={id}>
          <li className="flex p-2 text-grey-darkest">
            <div className="flex-grow">
              <FontAwesomeIcon icon="key" fixedWidth />
              <span className="ml-1">
                {id}
              </span>
            </div>

            <div>
              <IconButton
                icon="times"
                onClick={() => this.handleRemovePermission(id)}
              />
            </div>
          </li>
        </PermissionTransition>
      );
    });
  }

  @autobind
  handlePermissionDropdownChanged(perm) {
    addRolesToParentMethod.call({
      parent: this.props.role._id,
      role: perm.value
    }, e => {
      if (e) {
        NotificationManager.error(e.reason);
      }
    });
  }

  @autobind
  handleRemovePermission(perm) {
    removeRolesFromParentMethod.call({
      parent: this.props.role._id,
      role: perm
    }, e => {
      if (e) {
        NotificationManager.error(e.reason);
      }
    });
  }

  render() {
    const { props } = this;

    if (!props.ready || !props.role)
      return (
        <Loader size="xl" centered delay={1000} />
      );

    const { role } = props;

    const allPerms = _.chain(props.roles.list)
                      .filter(r => r.permission)
                      .map(r => r._id)
                      .value();

    const availablePerms = _.chain(allPerms)
                            .filter(r => !_.find(props.role.children, c => c._id === r))
                            .sortBy()
                            .value();

    return (
      <AdminLayout title="Manage Role">
        <div className="p-4">
          <h2 className="ml-2">
            <a href="#" className="link-dtek" onClick={props.history.goBack}>
              <FontAwesomeIcon icon="chevron-left" fixedWidth size="sm" />
            </a>
            <span className="ml-2">Role:</span>
            <span className="ml-1 text-dtek">{role._id}</span>
          </h2>

          <div>
            <div className="flex -mx-1">
              <div className="w-1/2 px-1">
                <div className="mt-2 rounded bg-white">
                  <ul className="w-full list-reset">
                    <li className="p-2 border-b border-grey-lighter">
                      Permissions
                    </li>

                    <TransitionGroup>
                      {this.getPermissions()}
                    </TransitionGroup>

                    <li className="p-2 border-t border-grey-lighter mt-2">
                      <Dropdown
                        placeholder="Add new permission"
                        noResultsText="No permissions available"
                        onChange={this.handlePermissionDropdownChanged}
                        options={availablePerms}
                      />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-1/2 px-1">
                <div className="mt-2 rounded bg-white">
                  <ul className="w-full list-reset">
                    <li className="p-2 border-b border-grey-lighter">
                      Inherited Permissions
                    </li>
                    {this.getInheritedPermissions()}
                 </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminRolePage;