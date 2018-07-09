import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import composeWithTracker from "/imports/helpers/composetracker";
import { Environment } from "/imports/api/environment";

import DocumentTitle from "/imports/ui/components/documenttitle";
import AuthorizedLayout from "/imports/ui/layouts/authorized";
import ForbiddenPage from "/imports/ui/pages/forbidden";

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

@composeWithTracker((props, onData) => {
  const handle = Meteor.subscribe("environment");
  
  if (handle.ready()) {
    const env = Environment.find().fetch();

    onData(null, {
      environment: env
    });

    return;
  }
  
  onData(null, {});
})
class EnvironmentPage extends Component {
  static defaultProps = {
    environment: []
  }

  render() {
    const { environment } = this.props;

    const tempSerie = [];
    const humiSerie = [];

    _.each(environment, e => {
      tempSerie.push([ e.date.getTime(), e.temperature ]);
      humiSerie.push([ e.date.getTime(), e.humidity ]);
    })

    const options = {
      colors: [ "#039be5", "#fb8c00" ],
      chart: {
        type: "spline",
        marginTop: 50
      },
      title: {
        text: null
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      },
      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          month: "%e. %b",
          year: "%b"
        },
        title: {
          text: "Date"
        }
      },
      yAxis: [
        {
          softMin: 20,
          softMax: 30,
          labels: {
            format: "{value}°C"
          },
          title: {
            text: "Temperature"
          }
        },
        {
          softMin: 30,
          softMax: 60,
          title: {
            text: "Humidity"
          },
          opposite: true
        }
      ],
      tooltip: {
        xDateFormat: "%A, %b %e, %H:%M:%S"
      },
      series: [
        {
          name: "Temperature",
          data: tempSerie,
          tooltip: {
            valueSuffix: "°C"
          }
        },
        {
          name: "Humidity",
          data: humiSerie,
          yAxis: 1,
          tooltip: {
            valueSuffix: ""
          }
        }
      ]
    };

    return (
      <AuthorizedLayout
        roles={["ENVIRONMENT_VIEW"]}
        failureContent={
          <ForbiddenPage />
        }
      >
        <div className="container mx-auto mt-4 p-4">
          <DocumentTitle title="Environment" />

          <h2 className="text-center">Temperature and humidity in DNollK's room</h2>

          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </AuthorizedLayout>
    );
  }
}

export default EnvironmentPage;