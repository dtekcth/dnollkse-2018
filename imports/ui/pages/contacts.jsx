import _ from "lodash";
import React, { Fragment as F, Component } from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom";

import MainLayout from "/imports/ui/layouts/main";
import Loader from "/imports/ui/components/loader";
import Markdown from "/imports/ui/components/markdown";

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

    return _.map(committee.data.members, (m, index) => {
      return (
        <div key={index} className="flex justify-between p-2">
          <div>{committee.data.fullMemberName(m)}</div>
          <div className="italic">{m.position}</div>
        </div>
      );
    });
  }

  getContacts() {
    const { settings } = this.props;

    const list = _.map(settings.data.contacts.list, (i, index) => {
      return (
        <div key={index} className="flex justify-between p-2">
          <div>{i.name}</div>
          <div className="italic">{i.value}</div>
        </div>
      );
    });

    return (
      <F>
        <div className="flex justify-between p-2">
          <div>Jour number</div>
          <div className="italic">{settings.data.contacts.jour}</div>
        </div>

        {list}
      </F>
    );
  }

  render() {
    const { props } = this;
    const { settings } = props;

    if (!props.settings.ready || !props.committee.ready) {
      return (
        <MainLayout title="Contacts" className="bg-grey-lighter">
          <Loader delay={1000} size="lg" />
        </MainLayout>
      );
    }

    return (
      <MainLayout title="Contacts" className="bg-grey-lighter">
        <div className="container mx-auto mt-4 mb-4">
          <h2 className="text-center">Contact Info</h2>

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
      </MainLayout>
    );
  }
}

export default ContactsPage;
