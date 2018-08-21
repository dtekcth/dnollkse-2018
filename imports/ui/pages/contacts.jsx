import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import cx from "classnames";

import Loader from "/imports/ui/components/loader";
import DocumentTitle from "/imports/ui/components/documenttitle";

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
    committee: state.committee
  };
};

@connect(mapStateToProps)
class ContactsPage extends Component {
  getCommittee() {
    const { committee } = this.props;

    if (committee.data.members.length === 0)
      return (
        <div className="p-2 text-grey italic">No committee members</div>
      );

    const count = committee.data.members.length;
    return _.map(committee.data.members, (m, index) => {
      return (
        <div
          key={index}
          className={
            cx("flex justify-between p-2",
               index !== count - 1 && "border-b border-dashed border-grey-light")
          }
        >
          <div className="flex items-center">
            {committee.data.fullMemberName(m)}
          </div>
          <div className="italic text-right">
            <div>{m.position}</div>

            {
              !!m.phone &&
              <div className="mt-1">{m.phone}</div>
            }
          </div>
        </div>
      );
    });
  }

  getContacts() {
    const { settings } = this.props;

    const allContacts = [
      { name: "Jour number", value: settings.data.contacts.jour },
      ...settings.data.contacts.list
    ];

    const count = allContacts.length;
    const list = _.map(allContacts, (i, index) => {
      return (
        <div
          key={index}
          className={
            cx("flex justify-between p-2",
               index !== count - 1 && "border-b border-dashed border-grey-light")
          }>
          <div>{i.name}</div>
          <div className="italic">{i.value}</div>
        </div>
      );
    });

    return (
      <F>
        {list}
      </F>
    );
  }

  render() {
    const { props } = this;
    const { settings } = props;

    if (!props.settings.ready || !props.committee.ready) {
      return (
        <Loader delay={1000} size="lg" />
      );
    }

    return (
      <div className="container mx-auto">
        <div className="mt-2">
          <div className="bg-white p-2 rounded mx-auto max-w-md">
            {this.getCommittee()}
          </div>
        </div>


        <div className="mt-3">
          <h2 className="text-center">Other Info</h2>

          <div className="bg-white p-2 rounded mx-auto max-w-md mt-2">
            {this.getContacts()}
          </div>
        </div>


        {
          !_.isEmpty(settings.data.contacts.irc) && 
          <div className="mt-3">
            <h2 className="text-center">IRC</h2>

            <div className="bg-white p-4 rounded mx-auto max-w-md mt-2">
              <span>IRC-kanal : </span>
              <span className="text-dtek">{settings.data.contacts.irc}</span>
              <span> på irc.dtek.se</span>

              <div className="mt-1">
                <span>Alternativt : </span>
                <Link to="https://irc.dtek.se/" className="link-dtek">
                  https://irc.dtek.se/
                </Link>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default ContactsPage;
