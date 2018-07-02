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
class FAQPage extends Component {
  getQuestions() {
    const { settings } = this.props;

    if (!settings.ready) {
      return <Loader delay={1000} />
    }

    if (settings.data.questions.length === 0) {
      return (
        <div className="bg-white rounded text-grey p-4">
          No questions
        </div>
      );
    }

    return _.map(settings.data.questions, (i, index) => {
      return (
        <div key={index} className="bg-white rounded p-4 mt-3">
          <h3>{i.question}</h3>

          <Markdown className="mt-2">
            {i.answer}
          </Markdown>
        </div>
      )
    });
  }

  render() {
    return (
      <MainLayout title="FAQ" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          <h2 className="text-center">FAQ</h2>

          <div className="mb-4">
            {this.getQuestions()}
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default FAQPage;

