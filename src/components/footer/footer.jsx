import React from "react";
// import Header component from the semantic-ui-react
import { Header } from "semantic-ui-react";
import "./footer.css";


function AppDashboard() {
  return (
    <>
      <Header className="centered">
			<p>
				Made by {" "}
				<a
					href="https://github.com/DBKW/"
					target="_blank"
					rel="noreferrer"
					className="github-link"
				>
					DrinkBeerKillWar.eth 
				</a>
			</p>
		</Header>
    </>
  );
}

export default AppDashboard;