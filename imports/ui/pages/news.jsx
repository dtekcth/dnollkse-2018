import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux"
import moment from "moment";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import DocumentTitle from "/imports/ui/components/documenttitle";
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

    return _.chain(news.list)
            .sortBy(i => i.date)
            .reverse()
            .map((i, index) => {
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
            })
            .value();
  }

  render() {
    return (
      <div className="container mx-auto">
        <div className="mb-4">
          {this.getNews()}
        </div>
      </div>
    );
  }
}

export default NewsPage;

