import React, { useState, useContext } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import { CurrentLocationContext } from "../../utils/currentLocationContext";
import { DataSourceContext } from "../../utils/DataSourceContext";

import NavigationControls from "../NavigationControls";
import SwitchLayers from "../SwitchLayers";
import Warning from "../Warning";

type OtherShips = {
	latitude: number;
	longitude: number;
	heading: number;
	email: string;
};
const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [selectedShip, setSelectedShip] = useState<OtherShips | null>(null);

	const selectShip = (ship: OtherShips) => {
		setSelectedShip(ship);
	};

	const _otherShips: OtherShips[] = [
		{
			email: "test",
			heading: 16,
			latitude: 17.00919245936354,
			longitude: 73.26283158874858,
		},

		{
			email: "test2",
			heading: 60,
			latitude: 17.00619945936354,
			longitude: 73.26783958874858,
		},
	];

	const { location: currentLocation } = useContext(CurrentLocationContext);

	const { dataSource } = useContext(DataSourceContext);

	return (
		<div>
			<NavigationControls />
			<SwitchLayers />
			<Warning />
			<ReactMapGl
				{...viewport}
				mapStyle={
					dataSource === "SATELLITE"
						? "mapbox://styles/mapbox/satellite-streets-v11"
						: "mapbox://styles/mapbox/streets-v11"
				}
				width="100vw"
				height="100vh"
				onViewportChange={(viewport) => {
					setViewport(viewport);
				}}
			>
				{_otherShips.map((ship) => (
					<Marker
						key={ship.email}
						latitude={ship.latitude}
						longitude={ship.longitude}
					>
						<button
							style={{
								background: "none",
								border: "none",
							}}
							onClick={() => selectShip(ship)}
						>
							<img
								style={{
									width: "36px",
									height: "36px",
									transform: `rotate(${ship.heading}deg)`,
								}}
								src="../ShipIcon.png"
								alt={ship.email}
							/>
						</button>
					</Marker>
				))}
				{currentLocation?.latitude && currentLocation?.longitude && (
					<Marker
						key="currentLocation"
						latitude={currentLocation?.latitude}
						longitude={currentLocation?.longitude}
					>
						<img
							style={{
								width: "36px",
								height: "36px",
								transform: `rotate(${
									currentLocation.heading || 0
								}deg)`,
							}}
							src="../YourShip.png"
							alt="Your Location"
						/>
					</Marker>
				)}
				{selectedShip && (
					<Popup
						latitude={selectedShip.latitude}
						longitude={selectedShip.longitude}
						onClose={() => setSelectedShip(null)}
					>
						<div>{selectedShip.email}</div>
					</Popup>
				)}
			</ReactMapGl>
		</div>
	);
};

export default Map;
