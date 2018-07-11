import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { compose } from "react-komposer";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";
import moment from "moment";

import AutoForm from "/imports/ui/components/autoform";
import IconButton from "/imports/ui/components/iconbutton";
import InputGroup from "/imports/ui/components/inputgroup";
import Loader from "/imports/ui/components/loader";
import RichTextEditor from "/imports/ui/components/richtexteditor";
import AdminLayout from "/imports/ui/layouts/admin";
import AuthorizedLayout from "/imports/ui/layouts/authorized";
import ForbiddenPage from "/imports/ui/pages/forbidden";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  newsCreateMethod,
  newsUpdateMethod,
} from "/imports/api/news";

const mapStateToProps = (state) => {
  return {
    news: state.news
  };
};

@connect(mapStateToProps)
@compose((props, onData) => {
  if (props.new) {
    onData(null, {});
    return;
  }

  const { postId } = props.match.params;

  const post = _.find(props.news.list, p => p._id == postId);
  onData(null, {
    post
  });
})
class AdminManagePostPage extends Component {
  static propTypes = {
    new  : PropTypes.bool,
    post : PropTypes.object
  }

  state = {
    title   : "",
    content : "",
    date    : new Date()
  }

  updateInfo() {
    const { post } = this.props;
    if (!post) return;

    const state = _.pick(post, [ "title", "date", "content" ])

    this.setState(state);
  }

  componentDidMount() {
    if (this.props.news.ready)
      this.updateInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.news.ready != prevProps.news.ready)
      this.updateInfo();
  }

  @autobind
  handleSave(e) {
    e.preventDefault();

    const { title, date, content } = this.state;
    
    const cb = e => {
      if (e) {
        NotificationManager.error(e.reason);
        console.error(e);
        
        return;
      }
      
      this.props.history.push("/admin/news");
    }
    
    if (this.props.new) {
      newsCreateMethod.call({
        title, date, content
      }, cb);
    }
    else {
      newsUpdateMethod.call({
        postId: this.props.post._id,
        title, date, content
      }, cb);
    }
  }

  renderSaveButton() {
    return (
      <button
        className={
          cx("py-1 px-2 rounded-full inline-block ml-1",
             "bg-green text-white hover:bg-green-dark transition-colors")
        }
      >
        <FontAwesomeIcon icon="check" fixedWidth />
        <span className="ml-1">Save</span>
      </button>
    );
  }

  renderPost() {
    return (
      <F>
        <div className="flex justify-end mt-2">
          {this.renderSaveButton()}
        </div>
      </F>
    );
  }

  render() {
    const { props } = this;

    if (!props.new && !props.news.ready)
      return (
        <AdminLayout>
          <div className="p-4 flex justify-center">
            <Loader size="lg" delay={1000} />
          </div>
        </AdminLayout>
      );

    const options = [
      { value: "list", key: "list", label: "List" },
      { value: "form", key: "form", label: "Form" },
    ];

    const currentOption = _.find(options, o => o.value == this.state.type);

    return (
      <AdminLayout title="Manage Post">
        <AuthorizedLayout
          roles={["ADMIN_MANAGE_NEWS"]}
          failureContent={<ForbiddenPage />}
        >
          <div className="p-4">
            <div className="px-1">
              <h2 className="ml-2">
                <a href="#" className="link-dtek" onClick={props.history.goBack}>
                  <FontAwesomeIcon icon="chevron-left" fixedWidth size="sm" />
                </a>
                <span className="ml-2">Post:</span>
                <span className="ml-1 text-dtek">
                  {props.new ? "New" : props.post.title}
                </span>
              </h2>

              <AutoForm
                onSubmit={this.handleSave}
                trimOnSubmit
              >
                <div className="mt-2 p-2 rounded bg-white">
                  <div>
                    <h3 className="ml-2 text-grey-dark">Post info</h3>

                    <InputGroup
                      className="mt-1"
                      text="Title"
                      value={this.state.title}
                      onChange={e => this.setState({ title: e.target.value })}
                    />

                    <InputGroup
                      datepicker
                      className="mt-1"
                      text="Date published"
                      value={moment(this.state.date)}
                      onChange={date => this.setState({ date: date.toDate() })} />

                    <InputGroup
                      className="mt-1"
                      richtext
                      text="Content"
                      value={this.state.content}
                      onChange={value => this.setState({ content: value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  {this.renderSaveButton()}
                </div>
              </AutoForm>
            </div>
          </div>
        </AuthorizedLayout>
      </AdminLayout>
    );
  }
}

export default AdminManagePostPage;