import React from "react";
import Map from "./Components/Map";
import "./styles/index.css";
import LocationContextProvider from "./utils/currentLocationContext";
import DataSourceContextProvider from "./utils/DataSourceContext";
const App: React.FC<any> = () => {
	return (
		<div>
			<LocationContextProvider>
				<DataSourceContextProvider>
					<Map />
				</DataSourceContextProvider>
			</LocationContextProvider>
		</div>
	);
};

export default App;
