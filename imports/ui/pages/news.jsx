import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux"
import moment from "moment";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import MainLayout from "/imports/ui/layouts/main";
import Loader from "/imports/ui/components/loader";

const mapStateToProps = (state) => {
  return {
    news: state.news
  };
};

@connect(mapStateToProps)
class NewsPage extends Component {
  getNews() {
    const { news } = this.props;

    return _.map(news.list, (i, index) => {
      return (
        <div key={index} className="bg-white rounded p-4 mt-3">
          <div className="flex justify-between">
            <h3>{i.title}</h3>
            <div className="text-grey">
              {moment(i.date).format("LLL")}
            </div>
          </div>

          {
            !_.isEmpty(i.content) && 
            <div className="mt-2">
              <FroalaEditorView
                model={i.content}
              />
            </div>
          }
        </div>
      )
    });
  }

  render() {
    return (
      <MainLayout title="News" className="bg-grey-lighter">
        <div className="container mx-auto mt-4">
          <h2 className="text-center">News</h2>

          <div className="mb-4">
            {this.getNews()}
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default NewsPage;

