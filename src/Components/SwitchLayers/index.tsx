import React, { useContext } from "react";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { DataSourceContext } from "../../utils/DataSourceContext";

type Props = {
	onEnableRadar: () => void;
	onEnableAIS: () => void;
	onEnableSatellite: () => void;
};

const SwitchLayers: React.FC<Props> = ({
	onEnableAIS,
	onEnableRadar,
	onEnableSatellite,
}) => {
	const { theme } = useContext(AppConfigContext);
	const { dataSource } = useContext(DataSourceContext);
	const darkMode = theme === "dark";
	return (
		<div
			className="absolute flex flex-col items-center bg-white z-10 rounded-lg justify-center"
			style={{
				filter: darkMode ? "invert(1)" : "none",
				position: "absolute",
				bottom: 112,
				right: 16,
			}}
		>
			<img
				src="/AIS.png"
				className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg"
				style={{
					filter: dataSource === "AIS" ? "invert(1)" : "none",
					padding: "19px",
					opacity: dataSource === "AIS" ? (darkMode ? 0.5 : 1) : 0.7,
				}}
				alt="AIS"
				onClick={onEnableAIS}
			/>

			<img
				src="/Satellite.svg"
				className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg"
				style={{
					padding: "19px",
					filter: dataSource === "SATELLITE" ? "invert(1)" : "none",
					opacity:
						dataSource === "SATELLITE" ? (darkMode ? 0.5 : 1) : 0.7,
				}}
				alt="Satellite"
				onClick={onEnableSatellite}
			/>
			<img
				className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg"
				src="/Radar.png"
				onClick={onEnableRadar}
				style={{
					padding: "19px",
					filter: dataSource === "RADAR" ? "invert(1)" : "none",
					opacity:
						dataSource === "RADAR" ? (darkMode ? 0.5 : 1) : 0.7,
				}}
				alt="Radar"
			/>
		</div>
	);
};

export default SwitchLayers;
