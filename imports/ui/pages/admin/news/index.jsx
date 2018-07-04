import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import IconButton from "/imports/ui/components/iconbutton"
import { ConfirmationPopup } from "/imports/ui/components/popup";
import AdminLayout from "/imports/ui/layouts/admin";
import Loader from "/imports/ui/layouts/admin";
import AuthorizedLayout from "/imports/ui/layouts/authorized";
import ForbiddenPage from "/imports/ui/pages/forbidden";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  newsRemoveMethod
} from "/imports/api/news";

let NewsTransition = (props) => (
  <CSSTransition
    {...props}
    classNames="role-anim"
    timeout={{ exit: 150, enter: 150 }}
  />
);

const mapStateToProps = (state) => {
  return {
    news: state.news
  };
};

@connect(mapStateToProps)
class AdminNewsPage extends Component {
  static propTypes = {
    news: PropTypes.object
  }

  static defaultProps = {
    news: {}
  }

  constructor(props) {
    super(props);
  }

  @autobind
  handleRemove(p) {
    newsRemoveMethod.call({ postId: p._id });
  }

  getNews() {
    const { news } = this.props;

    if (news.list.length === 0) {
      return (
        <NewsTransition key="_">
          <li className="text-grey p-2">
            No news
          </li>
        </NewsTransition>
      );
    }

    return _.chain(news.list)
            .sortBy(i => i.name)
            .reverse()
            .map((i, index) => {
              let deletePopup;

              return (
                <NewsTransition key={i._id}>
                  <li className="p-2 text-grey-darkest">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/admin/news/${i._id}`}
                          className="ml-2 link-dtek"
                        >
                          <FontAwesomeIcon icon="file-alt" fixedWidth />
                          <span className="ml-1">{i.title}</span>
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
                        onConfirm={() => this.handleRemove(i)}
                      />
                    </div>
                  </li>
                </NewsTransition>
              );
            })
            .value();
  }

  render() {
    const props = this.props;

    if (!props.news.ready) {
      return (
        <Loader delay={1000} size="lg" />
      );
    }

    return (
      <AdminLayout title="News">
        <AuthorizedLayout
          roles={["ADMIN_MANAGE_NEWS"]}
          failureContent={<ForbiddenPage />}
        >
          <div className="p-4">
            <div className="px-1">
              <div className="flex justify-between px-2">
                <h2 className="ml-2">News</h2>

                <Link
                  to="/admin/news/new"
                  className={
                    cx("button py-1 px-2 rounded-full inline-block",
                       "bg-green text-white hover:bg-green-dark transition-colors")
                  }
                >
                  <FontAwesomeIcon icon="plus" fixedWidth />
                  <span className="ml-1">Add new post</span>
                </Link>
              </div>

              <div className="mt-2 rounded bg-white">
                <ul className="list-reset mt-1">
                  <li className="p-2 border-b border-grey-lighter">
                    News
                  </li>

                  <TransitionGroup>
                    {this.getNews()}
                  </TransitionGroup>
                </ul>
              </div>
            </div>
          </div>
        </AuthorizedLayout>
            </AdminLayout>
    );
  }
}

export default AdminNewsPage;