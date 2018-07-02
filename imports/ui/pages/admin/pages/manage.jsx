import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { compose } from "react-komposer";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import PropTypes from "prop-types";

import AutoForm from "/imports/ui/components/autoform";
import IconButton from "/imports/ui/components/iconbutton";
import InputGroup from "/imports/ui/components/inputgroup";
import Loader from "/imports/ui/components/loader";
import RichTextEditor from "/imports/ui/components/richtexteditor";
import AdminLayout from "/imports/ui/layouts/admin";

import ListPage from "./list";
import FormPage from "./form";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  pagesCreateMethod,
  pagesUpdateMethod,
} from "/imports/api/pages";

const mapStateToProps = (state) => {
  return {
    pages: state.pages
  };
};

@connect(mapStateToProps)
@compose((props, onData) => {
  if (props.new) {
    onData(null, {});
    return;
  }

  const { pageId } = props.match.params;

  const page = _.find(props.pages.list, p => p._id == pageId);
  onData(null, {
    page
  });
})
class AdminManagePagePage extends Component {
  static propTypes = {
    new  : PropTypes.bool,
    page : PropTypes.object
  }

  state = {
    title : "",
    url  : "",
    type  : "",
    list  : { items: [] },
    form  : { text: "", url: "", embed: "" },
  }

  updateInfo() {
    const { page } = this.props;
    if (!page) return;

    const state = _.pick(page, [ "title", "url", "type" ])

    switch (page.type) {
      case "list":
        state.list = page.content;
        break;

      case "form":
        state.form = page.content;
        break;
    }

    this.setState(state);
  }

  componentDidMount() {
    if (this.props.pages.ready)
      this.updateInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.pages.ready != prevProps.pages.ready)
      this.updateInfo();
  }

  @autobind
  handleSave(e) {
    e.preventDefault();

    const { title, url, type, list, form } = this.state;

    let content;

    switch (type) {
      case "list":
        content = list;
        break;

      case "form":
        content = form;
        break;
    }
    
    const cb = e => {
      if (e) {
        NotificationManager.error(e.reason);
        console.error(e);
        
        return;
      }
      
      this.props.history.push("/admin/pages");
    }
    
    if (this.props.new) {
      pagesCreateMethod.call({
        title, url, type, content
      }, cb);
    }
    else {
      pagesUpdateMethod.call({
        pageId: this.props.page._id,
        title, url, type, content
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

  renderPage() {
    if (!this.state.type)
      return (
        <div className="text-grey p-2">Select a type</div>
      );

    switch (this.state.type) {
      case "list":
        return (
          <F>
            <ListPage
              ref={e => this.list = e}
              items={this.state.list.items}
              onChange={items => this.setState({ list: { items } })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.list.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add item</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );
        break;

      case "form":
        return (
          <F>
            <FormPage
              ref={e => this.list = e}
              text={this.state.form.text}
              url={this.state.form.url}
              embed={this.state.form.embed}
              onChange={data => this.setState({ form: data })}
            />

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>
          </F>
        );
        break;
    }
  }

  render() {
    const { props } = this;

    if (!props.new && !props.pages.ready)
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
      <AdminLayout title="Manage Page">
        <div className="p-4">
          <div className="px-1">
            <h2 className="ml-2">
              <a href="#" className="link-dtek" onClick={props.history.goBack}>
                <FontAwesomeIcon icon="chevron-left" fixedWidth size="sm" />
              </a>
              <span className="ml-2">Page:</span>
              <span className="ml-1 text-dtek">
                {props.new ? "New" : props.page.title}
              </span>
            </h2>

            <AutoForm
              onSubmit={this.handleSave}
              trimOnSubmit
            >
              <div className="mt-2 p-2 rounded bg-white">
                <div>
                  <h3 className="ml-2 text-grey-dark">Page info</h3>

                  <InputGroup
                    className="mt-1"
                    text="Title"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                  />

                  <InputGroup
                    className="mt-1"
                    text="url"
                    value={this.state.url}
                    onChange={e => this.setState({ url: e.target.value })}
                  />

                  <InputGroup
                    className="mt-1"
                    dropdown
                    text="Page type"
                    value={currentOption && currentOption.label}
                    options={options}
                    onChange={e => this.setState({ type: e.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                {this.renderSaveButton()}
              </div>

              <div className="mt-2">
                {this.renderPage()}
              </div>
            </AutoForm>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminManagePagePage;