import _ from "lodash";
import schedule from "node-schedule";
import rp from "request-promise-any";

import { Environment } from "/imports/api/environment";

const apiKey = process.env.THINGSPEAK_KEY;

let busy = false;

function syncEnvironment() {
  if (busy) return;

  const env = Environment.findOne({}, {
    sort: { date: -1, limit: 1 }
  });

  let url =
      "https://api.thingspeak.com/channels/522621/feeds.json?api_key=" +
      apiKey;

  url += "&results=8000";

  if (env) {
    url += "&start=" + env.date.toISOString();
    url += "&end=" + new Date().toISOString();
  }

  console.log("Syncing environment...");

  rp(url)
    .then((body) => {
      const data = JSON.parse(body);

      const newInserts = [];
      _.each(data.feeds, e => {
        const eDate = new Date(e.created_at);

        if (env && eDate <= env.date) return;

        if (!env || e.entry_id > env.entry_id) {
          newInserts.push({
            date: eDate,
            entry_id: e.entry_id,
            temperature: parseFloat(e.field1),
            humidity: parseFloat(e.field2)
          });
        }
      });

      if (newInserts.length > 0) {
        busy = true;

        Environment.batchInsert(newInserts, () => {
          busy = false;
        });
      }
    })
    .catch(e => {
      console.log(e);
    });
}

if (!apiKey) {
  console.log("ThingSpeak API key is not supplied in $THINGSPEAK_KEY");
}
else {
  syncEnvironment();

  Meteor.startup(function() {
    // const j = schedule.scheduleJob("*/5 * * * * *", 
    setInterval(Meteor.bindEnvironment(() => {
      syncEnvironment();
    }), 2 * 60 * 1000);
  });
}
