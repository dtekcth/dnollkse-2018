import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux"

import MainLayout from "/imports/ui/layouts/main";
import Loader from "/imports/ui/components/loader";
import Markdown from "/imports/ui/components/markdown";

const mapStateToProps = (state) => {
  return {
    settings: state.settings
  };
};

@connect(mapStateToProps)
class DocumentsPage extends Component {
  getDocuments() {
    const { settings } = this.props;

    if (!settings.ready) {
      return <Loader delay={1000} />
    }

    if (settings.data.documents.length === 0) {
      return (
        <div className="bg-white rounded text-grey p-4">
          No documents
        </div>
      );
    }

    return _.map(settings.data.documents, (i, index) => {
      return (
        <div key={index} className="bg-white rounded p-4 mt-3">
          <h3>{i.title}</h3>

          <Markdown className="mt-2">
            {i.text}
          </Markdown>
        </div>
      )
    });
  }

  render() {
    return (
      <MainLayout title="Documents" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          <h2 className="text-center">Documents</h2>

          <div className="mb-4">
            {this.getDocuments()}
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default DocumentsPage;