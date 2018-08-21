
import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import IconButton from "/imports/ui/components/iconbutton"
import AdminLayout from "/imports/ui/layouts/admin";
import Loader from "/imports/ui/layouts/admin";
import { ConfirmationPopup } from "/imports/ui/components/popup";
import AuthorizedLayout from "/imports/ui/layouts/authorized";
import ForbiddenPage from "/imports/ui/pages/forbidden";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  pagesRemoveMethod
} from "/imports/api/pages";

let PageTransition = (props) => (
  <CSSTransition
    {...props}
    classNames={cx("role-anim", props.className)}
    timeout={{ exit: 150, enter: 150 }}
  />
);

const mapStateToProps = (state) => {
  return {
    pages: state.pages
  };
};

@connect(mapStateToProps)
class AdminPagesPage extends Component {
  static propTypes = {
    pages: PropTypes.object
  }

  static defaultProps = {
    pages: {}
  }

  constructor(props) {
    super(props);
  }

  @autobind
  handleRemove(p) {
    pagesRemoveMethod.call({ pageId: p._id });
  }

  getPages() {
    const { pages } = this.props;

    if (pages.list.length === 0) {
      return (
        <PageTransition key="_">
          <li className="text-grey p-2">
            No pages
          </li>
        </PageTransition>
      );
    }

    return _.chain(pages.list)
            .sortBy(i => i.name)
            .reverse()
            .map((i, index) => {
              let deletePopup;

              return (
                <PageTransition
                  className="text-grey-darkest"
                  key={i._id}
                >
                  <tr>
                    <td className="p-2">
                      <div>
                        <Link
                          to={`/admin/pages/${i._id}`}
                          className="link-dtek"
                        >
                          <FontAwesomeIcon icon="file-alt" fixedWidth />
                          <span className="ml-1">{i.title}</span>
                        </Link>
                      </div>
                    </td>

                    <td className="p-2">
                      <span className="text-grey">
                        {i.url}
                      </span>
                    </td>

                    <td className="p-2">
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
                        onConfirm={() => this.handleRemove(i)}
                      />
                    </td>
                  </tr>
                </PageTransition>
              );
            })
            .value();
  }

  render() {
    const props = this.props;

    if (!props.pages.ready) {
      return (
        <Loader delay={1000} size="lg" />
      );
    }

    return (
      <AdminLayout title="Pages">
        <AuthorizedLayout
          roles={["ADMIN_MANAGE_PAGES"]}
          failureContent={<ForbiddenPage />}
        >
          <div className="p-4">
            <div className="px-1">
              <div className="flex justify-between px-2">
                <h2 className="ml-2">Pages</h2>

                <Link
                  to="/admin/pages/new"
                  className={
                    cx("button py-1 px-2 rounded-full inline-block",
                       "bg-green text-white hover:bg-green-dark transition-colors")
                  }
                >
                  <FontAwesomeIcon icon="plus" fixedWidth />
                  <span className="ml-1">Add new page</span>
                </Link>
              </div>

              <div className="mt-2 rounded bg-white">
                <table className="w-full table-reset table-auto mt-1">
                  <thead>
                    <tr>
                      <th
                        align="left"
                        className="font-normal p-2 border-b border-grey-lighter w-full"
                      >
                        Pages
                      </th>
                      <th
                        align="left"
                        className="font-normal p-2 border-b border-grey-lighter"
                      >
                        Route
                      </th>
                      <th className="border-b border-grey-lighter"></th>
                    </tr>
                  </thead>

                  <tbody>
                    <TransitionGroup component={null}>
                      {this.getPages()}
                    </TransitionGroup>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AuthorizedLayout>
      </AdminLayout>
    );
  }
}

export default AdminPagesPage;