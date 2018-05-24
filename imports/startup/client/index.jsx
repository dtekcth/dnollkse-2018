import React, { Component } from "react";
import { mount } from "react-mounter";

import {
  BrowserRouter as Router
} from "react-router-dom";

import { DocHead } from "meteor/kadira:dochead";

import App from "/imports/ui/app.jsx";

require("velocity-animate");
require("velocity-animate/velocity.ui");

// Import Redux store
import '/imports/store';

// Import users api
import "/imports/api/users";
import "/imports/api/users/client";

DocHead.addMeta({ name: "viewport", content: "initial-scale=0.5, minimum-scale=0.5" });
DocHead.addMeta({ name: "theme-color", content: "#FA6607" });

const Root = () => ( 
  <Router>
    <App />
  </Router>
);


mount(Root);

