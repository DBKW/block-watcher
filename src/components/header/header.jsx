import React from "react";
// import Header component from the semantic-ui-react
import { Header } from "semantic-ui-react";
import "./header.css";


function AppDashboard() {
  return (
    <>
      <Header as="h2" block className="centered">
        <p>
        The Block Watcher
        </p>
      </Header>
    </>
  );
}

export default AppDashboard;