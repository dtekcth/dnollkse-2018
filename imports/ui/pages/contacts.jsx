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

    if (settings.data.contacts.length === 0)
      return (
        <div className="p-2 text-grey italic">No contacts</div>
      );

    return _.map(settings.data.contacts, (i, index) => {
      return (
        <div key={index} className="flex justify-between p-2">
          <div>{i.name}</div>
          <div className="italic">{i.value}</div>
        </div>
      );
    });
  }

  render() {
    const { props } = this;

    if (!props.settings.ready || !props.committee.ready) {
      return (
        <MainLayout title="Contacts" className="bg-grey-lighter">
          <Loader delay={1000} size="lg" />
        </MainLayout>
      );
    }

    return (
      <MainLayout title="Contacts" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          <h2 className="text-center">Contact Information</h2>

          <div className="mt-2">
            <div className="bg-white p-2 rounded mx-auto max-w-md">
              {this.getCommittee()}
            </div>
          </div>

          <h2 className="text-center mt-3">Contacts</h2>

          <div className="mt-2">
            <div className="bg-white p-2 rounded mx-auto max-w-md">
              {this.getContacts()}
            </div>
          </div>

          <h2 className="text-center mt-3">IRC</h2>

          <div className="mt-2 mb-4">
            <div className="bg-white p-4 rounded mx-auto max-w-md">
              <div>IRC-kanal : #dtek på irc.dtek.se</div>

              <div>
                <span>Alternativt : </span>
                <Link to="https://irc.dtek.se/" className="link-dtek">
                  https://irc.dtek.se/
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default ContactsPage;
