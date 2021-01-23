import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
import { useHistory } from "react-router-dom";
import { CurrentLocationContext } from "../../utils/currentLocationContext";
import { DataSourceContext } from "../../utils/DataSourceContext";
import socket from "../../utils/socket";

import NavigationControls from "../NavigationControls";
import SwitchLayers from "../SwitchLayers";
import Warning from "../Warning";

type OtherShips = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
	email: string;
	name: string;
};

type SocketShipData = {
	email: string;
	name: string;
	location: {
		latitude: number;
		longitude: number;
		heading: number;
		speed: number;
	};
	lastUpdated: string;
};
const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [selectedShip, setSelectedShip] = useState<OtherShips | null>(null);

	const [ships, setShips] = useState<OtherShips[] | null>([]);

	const selectShip = (ship: OtherShips) => {
		setSelectedShip(ship);
	};
	const {
		location: currentLocation,
		email,
		setEmail,
		setLocation,
	} = useContext(CurrentLocationContext);

	const windowLocation = useHistory();

	useEffect(() => {
		axios
			.get("http://localhost:4000/ships", {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					setShips(res.data);
				}
			})
			.catch((err) => {
				alert("An error occured");
				console.error(err);
			});
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:4000/api/users/current", {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200 && res.data && res.data.email) {
					setEmail(res.data.email);
					setViewport({
						...viewport,
						latitude: res.data.latitude,
						longitude: res.data.longitude,
					});
					setLocation({
						heading: res.data.heading,
						latitude: res.data.latitude,
						longitude: res.data.longitude,
						speed: res.data.speed,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				windowLocation.replace("/");
			});
	}, []);

	const { dataSource } = useContext(DataSourceContext);

	useEffect(() => {
		socket.on("AIS_SIGNAL_RECEIVED", (data: SocketShipData) => {
			console.log("AIS_SIGNAL_RECEIVED", data.email);
			if (data.email && ships) {
				const allShips = [...ships];
				console.log(ships);
				const shipIndex = allShips.findIndex(
					(e) => e.email === data.email
				);
				if (shipIndex !== -1) {
					console.log("exists");
					allShips[shipIndex].latitude = data.location.latitude;
					allShips[shipIndex].longitude = data.location.longitude;
					allShips[shipIndex].heading = data.location.heading;
					allShips[shipIndex].speed = data.location.speed;
					setShips(allShips);
				} else {
					console.log("Doesnt exist");
					setShips([
						...allShips,
						{
							email: data.email,
							heading: data.location.heading,
							speed: data.location.speed,
							latitude: data.location.latitude,
							longitude: data.location.longitude,
							name: data.name,
						},
					]);
				}
			}
		});
	}, [ships]);

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
				{ships?.map((ship) => (
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
