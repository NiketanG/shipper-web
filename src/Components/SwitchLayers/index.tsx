import React, { useContext, useState } from "react";
import { DataSourceContext } from "../../utils/DataSourceContext";

const SwitchLayers: React.FC<any> = () => {
	const { dataSource, setDataSource } = useContext(DataSourceContext);

	return (
		<div
			style={{
				position: "absolute",
				top: 16,
				left: 16,
				zIndex: 10,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<img
				src="/AIS.png"
				style={{
					width: "36px",
					height: "36px",
					backgroundColor: "white",
					filter: dataSource === "AIS" ? "invert(1)" : "",
					padding: "10px",
					borderRadius: "4px",
				}}
				alt="AIS"
				onClick={() => setDataSource("AIS")}
			/>

			<img
				src="/Satellite.png"
				style={{
					width: "36px",
					height: "36px",
					padding: "10px",
					borderRadius: "4px",
					marginTop: "4px",
					backgroundColor:
						dataSource === "SATELLITE" ? "black" : "white",
				}}
				alt="Satellite"
				onClick={() => setDataSource("SATELLITE")}
			/>
			<img
				src="/Radar.png"
				onClick={() => setDataSource("RADAR")}
				style={{
					width: "36px",
					height: "36px",
					padding: "10px",
					borderRadius: "4px",
					marginTop: "4px",
					filter: dataSource === "RADAR" ? "invert(1)" : "",
					backgroundColor: "white",
				}}
				alt="Radar"
			/>
		</div>
	);
};

export default SwitchLayers;
