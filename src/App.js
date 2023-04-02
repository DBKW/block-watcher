// import the header component
//import { useEffect, useState } from "react";
//import "./App.css";
//import { ReactDOM } from "react-dom";
// import the blockNumber component
//import EthOverview from "./components/ethoverview/index";

import React from "react";
import { Alchemy, Network } from 'alchemy-sdk';
import './App.css';
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./components/header/index";
import EthOverview from "./components/ethoverview/index";
import Footer from "./components/footer/index";

const settings = {
	apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
	network: Network.ETH_MAINNET,
  };

export const alchemy = new Alchemy(settings);


function App() {
return (
	<>

		<div className="App">
			<Header />
			<EthOverview />
			<Footer />
		</div>	
	</>
//<div className="App">
//		<Header />
//		<EthOverview />
//	</div>
 );
 }

export default App;