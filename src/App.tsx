import React from "react";
import Map from "./Components/Map";
import "./styles/index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AppContextProvider from "./utils/AppConfigContext";
import DataSourceContextProvider from "./utils/DataSourceContext";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

const App: React.FC<any> = () => (
	<Router>
		<Switch>
			<AppContextProvider>
				<DataSourceContextProvider>
					<Route path="/map">
						<Map />
					</Route>
					<Route path="/settings">
						<Settings />
					</Route>
					<Route path="/" exact>
						<Login />
					</Route>
				</DataSourceContextProvider>
			</AppContextProvider>
		</Switch>
	</Router>
);

export default App;
