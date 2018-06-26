import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { NotificationManager } from "react-notifications";
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import autobind from "autobind-decorator";
import cx from "classnames";
import update from "immutability-helper";
import marked from "marked";
import PropTypes from "prop-types";

import AutoForm from "/imports/ui/components/autoform";
import InputGroup from "/imports/ui/components/inputgroup";
import Loader from "/imports/ui/components/loader";
import RichTextEditor from "/imports/ui/components/richtexteditor";
import SelectableImage from "/imports/ui/components/selectableimage";
import AdminLayout from "/imports/ui/layouts/admin";

import composeWithTracker from "/imports/helpers/composetracker";

import {
  Committees,
  committeeCreateMethod,
  committeeUpdateMethod,
} from "/imports/api/committees";

@composeWithTracker((props, onData) => {
  if (props.new) {
    onData(null, { ready: true });
    return;
  }

  const { committeeId } = props.match.params;
  const handle = Meteor.subscribe("committees.id", committeeId)

  if (handle.ready()) {
    const committee = Committees.findOne(committeeId);

    onData(null, {
      committee,
      ready: true
    });

    return;
  }

  onData(null, { ready: false });
})
class AdminManageCommitteePage extends Component {
  static propTypes = {
    committee: PropTypes.object
  }

  state = {
    name: "",
    description: "",
    members: []
  }

  componentDidUpdate(prevProps) {
    if (this.props.ready != prevProps.ready) {
      const { committee } = this.props;

      this.setState({
        name        : committee.name,
        description : committee.description,
        logo        : committee.logo,
        cover       : committee.cover,
        members     : committee.members
      });
    }
  }

  @autobind
  handleSave(e, data) {
    e.preventDefault();

    const { name, description, logo, cover, members } = this.state;

    const cb = e => {
      if (e) {
        NotificationManager.error(e.reason);
        console.error(e);

        return;
      }
      
      this.props.history.push("/admin/committees");
    }

    if (this.props.new) {
      committeeCreateMethod.call({
        name, description, logo, cover, members
      }, cb);
    }
    else {
      committeeUpdateMethod.call({
        committeeId: this.props.committee._id,
        name, description, logo, cover, members
      }, cb);
    }
  }

  @autobind
  handleAddMember(e) {
    const newMember = {
      firstname   : "",
      lastname    : "",
      nickname    : "",
      description : "",
      position    : ""
    };

    this.setState({
      members: update(this.state.members, { $push: [ newMember ] })
    });
  }

  @autobind
  handleRemoveMember(index) {
    this.setState({
      members: update(this.state.members, { $splice: [[ index, 1 ]] })
    });
  }

  @autobind
  handleMemberDataChanged(index, field, value) {
    const member = this.state.members[index];
    if (!member) return;

    this.setState({
      members: update(this.state.members, {
        [index]: {
          $merge: {
            [field]: value
          }
        }
      })
    })
  }

  @autobind
  handleDataChanged(field, value) {
    this.setState({
      [field]: value
    });
  }

  @autobind
  renderMemberInput(props) {
    if (props.textarea) {
      return (
        <RichTextEditor
          className={props.className}
          value={props.value}
          onChange={
            value =>
              this.handleMemberDataChanged(props.index, props.field, value)
          }
        />
      );
    }

    return (
      <InputGroup
        value={props.value}
        textarea={props.textarea}
        rows={props.rows}
        text={props.text}
        className={props.className}
        onChange={
          e => this.handleMemberDataChanged(props.index, props.field, e.target.value)
        }
      />
    );
  }

  getMembers() {
    const { members } = this.state;

    const InputHelper = this.renderMemberInput;
    
    return _.map(members, (m, index) => {
      return (
        <div key={index} className="mt-2 p-2 rounded bg-white">
          <div className="flex -mx-1">
            <div className="flex items-center w-1/3 md:w-1/4 xl:w-1/5 px-1">
              <SelectableImage
                placeholder="/static/images/placeholder-member.png"
                imageId={m.image}
                onChange={
                  img =>
                    this.handleMemberDataChanged(index, "image", img._id)
                }
              />
            </div>

            <div className="w-2/3 md:w-3/4 xl:w-4/5 px-1">
              <InputHelper
                index={index} value={m.firstname}
                text="First name" field="firstname"
              />
              <InputHelper
                index={index} value={m.lastname}
                text="Last name" field="lastname" className="mt-1"
              />
              <InputHelper
                index={index} value={m.nickname}
                text="Nickname" field="nickname" className="mt-1"
              />
              <InputHelper
                index={index} value={m.position}
                text="Position" field="position" className="mt-1"
              />

              <InputHelper
                index={index}
                value={m.description}
                text="Description"
                field="description"
                className="mt-1"
                textarea
                rows="8"
              />
            </div>

            <div className="px-1 mt-1">
              <button
                type="button"
                className={
                  cx("inline-flex justify-center items-center",
                     "w-6 h-6 rounded-full transition-colors",
                     "bg-transparent hover:bg-red",
                     "text-red hover:text-white")
                }
                onClick={e => this.handleRemoveMember(index)}
              >
                <FontAwesomeIcon icon="times" fixedWidth size="sm" />
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    const { props } = this;

    if (!props.new && !props.ready)
      return (
        <AdminLayout>
          <div className="p-4 flex justify-center">
            <Loader size="lg" delay={1000} />
          </div>
        </AdminLayout>
      );

    const saveBtn = (
      <button
        className={
          cx("py-1 px-2 rounded-full inline-block",
             "bg-green text-white hover:bg-green-dark transition-colors")
        }
      >
        <FontAwesomeIcon icon="check" fixedWidth />
        <span className="ml-1">Save</span>
      </button>
    );

    return (
      <AdminLayout title="Manage Committee">
        <div className="p-4">
          <div className="px-1">
            <h2 className="ml-2">
              <a href="#" className="link-dtek" onClick={props.history.goBack}>
                <FontAwesomeIcon icon="chevron-left" fixedWidth size="sm" />
              </a>
              <span className="ml-2">Committee:</span>
              <span className="ml-1 text-dtek">
                {props.new ? "New" : props.committee.name}
              </span>
            </h2>

            <AutoForm
              onSubmit={this.handleSave}
              trimOnSubmit
            >
              <div className="mt-2 p-2 rounded bg-white">
                <div className="w-2/3 mx-auto">
                  <h3 className="ml-2 text-grey-dark">Cover</h3>

                  <SelectableImage
                    className="mt-1"
                    placeholder="/static/images/placeholder-cover.png"
                    imageId={this.state.cover}
                    onChange={
                      img =>
                        this.setState({ cover: img._id })
                    }
                  />
                </div>

                <div className="flex -mx-1 mt-2">
                  <div className="flex items-center w-1/2 md:w-1/3 xl:w-1/4 px-1">
                    <div>
                      <h3 className="ml-2 text-grey-dark">Logo</h3>

                      <SelectableImage
                        className="mt-1"
                        imageId={this.state.logo}
                        placeholder="/static/images/placeholder-logo.png"
                        onChange={
                          img =>
                            this.setState({ logo: img._id })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-1/2 md:w-2/3 xl:w-3/4 px-1">
                    <h3 className="ml-2 text-grey-dark">Info</h3>

                    <InputGroup
                      className="mt-1"
                      text="Name"
                      value={this.state.name}
                      onChange={e => this.handleDataChanged("name", e.target.value)}
                    />

                    <RichTextEditor
                      className="mt-1"
                      value={this.state.description}
                      onChange={
                        value =>
                          this.handleDataChanged("description", value)
                      }
                    />
                  </div>
                </div>
              </div>

              {
                this.state.members.length > 0 ?
                <F>
                  <div className="flex justify-end mt-2">
                    {saveBtn}
                  </div>
                  <div className={
                    cx("mt-4", this.state.members.length > 0 ?
                       "border-grey-light" : "border-transparent")
                  }>
                    <h3 className="ml-2 text-grey-dark">Members</h3>

                    <div className="mt-1">
                      {this.getMembers()}
                    </div>
                  </div>
                </F> :
                <div></div>
              }

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className={
                    cx("mr-1 py-1 px-2 rounded-full inline-block",
                       "bg-blue text-white hover:bg-blue-dark transition-colors")
                  }
                  onClick={this.handleAddMember}
                >
                  <FontAwesomeIcon icon="user-plus" fixedWidth />
                  <span className="ml-1">Add member</span>
                </button>

                {saveBtn}
              </div>
            </AutoForm>
          </div>
        </div>
      </AdminLayout>
    );
  }
}

export default AdminManageCommitteePage;