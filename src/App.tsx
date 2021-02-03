import React from "react";
import Map from "./Components/Map";
import "./styles/index.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppContextProvider from "./utils/AppConfigContext";
import DataSourceContextProvider from "./utils/DataSourceContext";
import Login from "./Components/Login";

const MapPage: React.FC<any> = () => {
	return (
		<AppContextProvider>
			<DataSourceContextProvider>
				<Map />
			</DataSourceContextProvider>
		</AppContextProvider>
	);
};

const App: React.FC<any> = () => {
	return (
		<Router>
			<Switch>
				<Route path="/map">
					<MapPage />
				</Route>
				<Route path="/">
					<Login />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
