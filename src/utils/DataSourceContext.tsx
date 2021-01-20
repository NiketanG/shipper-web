/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

type DataSourceContextType = {
	dataSource: "AIS" | "SATELLITE" | "RADAR";
	setDataSource: (newDataSource: "AIS" | "SATELLITE" | "RADAR") => void;
};

export const DataSourceContext = createContext<DataSourceContextType>({
	dataSource: "AIS",
	setDataSource: () => {},
});

type Props = {
	children: React.ReactNode;
};

const DataSourceContextProvider: React.FC<Props> = ({ children }) => {
	const [dataSource, setDataSource] = useState<"AIS" | "SATELLITE" | "RADAR">(
		"AIS"
	);

	const updateDataSource = (newSource: "AIS" | "SATELLITE" | "RADAR") => {
		setDataSource(newSource);
	};

	return (
		<DataSourceContext.Provider
			value={{
				dataSource,
				setDataSource: updateDataSource,
			}}
		>
			{children}
		</DataSourceContext.Provider>
	);
};

export default DataSourceContextProvider;
