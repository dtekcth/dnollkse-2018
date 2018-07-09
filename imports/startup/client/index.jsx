import { analytics } from "meteor/okgrow:analytics";

import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import { mount } from "react-mounter";
import { Provider } from "react-redux";
import moment from "moment";

import {
  BrowserRouter as Router
} from "react-router-dom";

import { DocHead } from "meteor/kadira:dochead";

import App from "/imports/ui/app";

require("velocity-animate");
require("velocity-animate/velocity.ui");

require("./fontawesome");

// Import Redux store
import store from "/imports/store";

// Import settings api
import "/imports/api/settings";
import "/imports/api/settings/client";

// Import pages api
import "/imports/api/pages";
import "/imports/api/pages/client";

// Import news api
import "/imports/api/news";
import "/imports/api/news/client";

// Import environment api
import "/imports/api/environment";

// Import images api
import "/imports/api/images";

// Import users api
import "/imports/api/users";
import "/imports/api/users/client";

// Import committees api
import "/imports/api/committees";
import "/imports/api/committees/client";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

const Root = () => ( 
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);


mount(Root);
