import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import update from "immutability-helper";

import AutoForm from "/imports/ui/components/autoform";
import InputGroup from "/imports/ui/components/inputgroup";
import Loader from "/imports/ui/components/loader";
import AdminLayout from "/imports/ui/layouts/admin";

import SettingsNavigation from "./navigation.jsx";
import SettingsFAQ from "./faq.jsx";
import SettingsLinks from "./links.jsx";
import SettingsDocuments from "./documents.jsx";
import SettingsContact from "./contact.jsx";

import composeWithTracker from "/imports/helpers/composetracker";
import { Committees } from "/imports/api/committees";
import { Settings, settingsUpdateMethod } from "/imports/api/settings";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@connect(mapStateToProps)
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
class AdminSettingsPage extends Component {
  static propTypes = {
  }

  static defaultProps = {
    committees: [],
    settings: {}
  }

  state = {
    navigation : [],
    questions  : [],
    links      : [],
    documents  : [],
    contacts   : [],
    page       : "nav"
  }

  componentDidMount() {
    if (this.props.settings.ready)
      this.updateSettings();
  }

  componentDidUpdate(prevProps) {
    if (this.props.settings.ready && !prevProps.settings.ready)
      this.updateSettings();
  }

  updateSettings() {
    const s = this.props.settings.data;

    this.setState(_.pick(s, [ "committee", "gcalId", "gcalKey",
                              "navigation", "questions", "links", "documents",
                              "contacts" ]));
  }

  @autobind
  handleSave(e) {
    e.preventDefault();

    settingsUpdateMethod.call(
      _.pick(this.state, [ "committee", "gcalId", "gcalKey",
                           "navigation", "questions", "links", "documents",
                           "contacts" ]),
      err => {
        if (err) {
          NotificationManager.error(err.reason);
          console.error(err);
          return;
        }

        NotificationManager.success("Saved settings!");
      }
    );
  }

  renderSaveButton() {
    return (
      <button
        className={
          cx("py-1 px-2 rounded-full inline-block ml-2",
             "bg-green text-white hover:bg-green-dark transition-colors")
        }
      >
        <FontAwesomeIcon icon="check" fixedWidth />
        <span className="ml-1">Save</span>
      </button>
    );
  }

  renderTabs() {
    const tabs = [
      [ "nav", "Navigation" ],
      [ "contact", "Contact" ]
    ];

    const tabItems = _.map(tabs, ([ name, text ], i) => (
      <li key={i} className={cx(this.state.page === name && "active")}>
        <a
          href="#"
          onClick={
            e => {
              e.preventDefault();
              this.setState({ page: name })
            }
          }
        >
          {text}
        </a>
      </li>
    ));

    let content;

    switch (this.state.page) {
      case "nav":
        content = (
          <F>
            <SettingsNavigation
              ref={e => this.navList = e }
              navigation={this.state.navigation}
              onChange={navigation => this.setState({ navigation })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.navList.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add navlink</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );

        break;
      case "faq":
        content = (
          <F>
            <SettingsFAQ
              ref={e => this.faqList = e }
              questions={this.state.questions}
              onChange={questions => this.setState({ questions })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.faqList.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add question</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );

        break;
      case "links":
        content = (
          <F>
            <SettingsLinks
              ref={e => this.linksList = e }
              links={this.state.links}
              onChange={links => this.setState({ links })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.linksList.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add link</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );

        break;
      case "docs":
        content = (
          <F>
            <SettingsDocuments
              ref={e => this.docList = e }
              documents={this.state.documents}
              onChange={documents => this.setState({ documents })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.docList.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add document</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );

        break;
      case "contact":
        content = (
          <F>
            <SettingsContact
              ref={e => this.contactList = e }
              contacts={this.state.contacts}
              onChange={contacts => this.setState({ contacts })}
            />

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className={
                  cx("py-1 px-2 rounded-full inline-block",
                     "bg-blue text-white hover:bg-blue-dark transition-colors")
                }
                onClick={e => this.contactList.addItem()}
              >
                <FontAwesomeIcon icon="plus" fixedWidth />
                <span className="ml-1">Add contact info</span>
              </button>

              {this.renderSaveButton()}
            </div>
          </F>
        );

        break;
    }

    return (
      <F>
        <ul className="tabs mt-2">
          {tabItems}
        </ul>

        <div className="mt-2">
          {content}
        </div>
      </F>
    );
  }


  render() {
    if (!this.props.settings.ready) {
      return (
        <AdminLayout>
          <Loader delay={1000} size="lg" />
        </AdminLayout>
      );
    }

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
          <AutoForm
            onSubmit={this.handleSave}
            trimOnSubmit
          >
            <h2 className="ml-2">General Settings</h2>

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

              <InputGroup
                className="mt-1"
                value={this.state.gcalId || ""}
                placeholder="Google Calendar ID..."
                text="Google Calendar ID"
                onChange={
                  e => this.setState({ gcalId: e.target.value })
                }
              />

              <InputGroup
                className="mt-1"
                value={this.state.gcalKey || ""}
                placeholder="Google Calendar API Key..."
                text="Google Calendar API Key"
                onChange={
                  e => this.setState({ gcalKey: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end mt-2">
              {this.renderSaveButton()}
            </div>

            <div className="mt-2">
              <h3 className="ml-2">Other Settings</h3>

              {this.renderTabs()}
            </div>
          </AutoForm>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminSettingsPage;