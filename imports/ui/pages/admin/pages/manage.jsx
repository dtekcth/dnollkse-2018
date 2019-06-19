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

import ListPage from "./list";
import FormPage from "./form";
import CommitteePage from "./committee";
import StudentDivisionPage from "./studentdivision";

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
    title           : "",
    url             : "",
    type            : "",
    list            : { items       : [] },
    form            : { text        : "", url     : "", embed   : "" },
    document        : { text        : "" },
    redirect        : { url         : "" },
    committee       : { committeeId : "" },
    studentDivision : { committeeId : "" },
    schedule        : { gcalId      : "", params  : "", minDate : moment(), text : "" },
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

      case "document":
        state.document = page.content;
        break;

      case "redirect":
        state.redirect = page.content;
        break;

      case "committee":
        state.committee = page.content;
        break;

      case "studentDivision":
        state.studentDivision = page.content;
        break;

      case "schedule":
        state.schedule = page.content;
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

    const { title, url, type } = this.state;

    let content;

    switch (type) {
      case "list":
        content = this.state.list;
        break;

      case "form":
        content = this.state.form;
        break;

      case "document":
        content = this.state.document;
        break;

      case "redirect":
        content = this.state.redirect;
        break;

      case "committee":
        content = this.state.committee;
        break;

      case "studentDivision":
        content = this.state.studentDivision;
        break;

      case "schedule":
        content = this.state.schedule;
        break;
    }
    
    const cb = (e, id) => {
      if (e) {
        NotificationManager.error(e.reason);
        console.error(e);
        
        return;
      }
      
      NotificationManager.success("Saved changes!");

      if (this.props.new) {
        this.props.history.push("/admin/pages/" + id);
      }
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

      case "form":
        return (
          <F>
            <FormPage
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

      case "document":
        return (
          <F>
            <div className="p-2 bg-white rounded">
              <InputGroup
                richtext
                value={this.state.document.text || ""}
                placeholder="Content..."
                text="Content"
                onChange={
                  text => this.setState({ document: { text } })
                }
              />
            </div>

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>
          </F>
        );

      case "redirect":
        return (
          <F>
            <div className="p-2 bg-white rounded">
              <InputGroup
                value={this.state.redirect.url || ""}
                placeholder="URL..."
                text="Redirect URL"
                onChange={
                  e => this.setState({
                    redirect: { url: e.target.value }
                  })
                }
              />
            </div>

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>
          </F>
        );

      case "committee":
        return (
          <F>
            <CommitteePage
              committeeId={this.state.committee.committeeId}
              onChange={data => this.setState({ committee: data })}
            />

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>
          </F>
        );
        break;

      case "studentDivision":
        return (
          <F>
            <StudentDivisionPage
              committeeId={this.state.studentDivision.committeeId}
              predecessors={this.state.studentDivision.predecessors}
              others={this.state.studentDivision.others}
              onChange={
                data => this.setState({
                  studentDivision: {
                    ...this.state.studentDivision,
                    ...data
                  }
                })
              }
            />

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>
          </F>
        );
        break;

      case "schedule":
        return (
          <F>
            <div className="p-2 bg-white rounded">
              <InputGroup
                value={this.state.schedule.gcalId || ""}
                placeholder="Google Calendar ID..."
                text="Google Calendar ID"
                onChange={
                  e => this.setState({
                    schedule: { ...this.state.schedule, gcalId: e.target.value }
                  })
                }
              />

              <InputGroup
                datepicker
                className="mt-1"
                text="Minimum date"
                value={moment(this.state.schedule.minDate)}
                onChange={
                  date => this.setState({
                    schedule: { ...this.state.schedule, minDate: date.toDate() }
                  })
                }
              />

              <InputGroup
                richtext
                className="mt-1"
                text="Text"
                value={this.state.schedule.text}
                onChange={
                  text => this.setState({
                    schedule: { ...this.state.schedule, text }
                  })
                }
              />

              <InputGroup
                textarea
                className="mt-1"
                text="Custom parameters (JSON)"
                value={this.state.schedule.params}
                rows={10}
                onChange={
                  e => this.setState({
                    schedule: { ...this.state.schedule, params: e.target.value }
                  })
                }
              />
            </div>

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
      { value : "list"            , key : "list"            , label : "List" },
      { value : "form"            , key : "form"            , label : "Form" },
      { value : "document"        , key : "document"        , label : "Document" },
      { value : "redirect"        , key : "redirect"        , label : "Redirect" },
      { value : "committee"       , key : "committee"       , label : "Committee" },
      { value : "studentDivision" , key : "studentDivision" , label : "Student Division" },
      { value : "news"            , key : "news"            , label : "News" },
      { value : "contacts"        , key : "contacts"        , label : "Contacts" },
      { value : "schedule"        , key : "schedule"        , label : "Schedule" },
    ];

    const currentOption = _.find(options, o => o.value == this.state.type);

    return (
      <AdminLayout title="Manage Page">
        <AuthorizedLayout
          roles={["ADMIN_MANAGE_PAGES"]}
          failureContent={<ForbiddenPage />}
        >
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
        </AuthorizedLayout>
      </AdminLayout>
    );
  }
}

export default AdminManagePagePage;