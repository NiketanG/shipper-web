import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import ReactMapGl, {
	ViewportProps,
	Marker,
	Popup,
	Source,
	Layer,
	FlyToInterpolator,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";

// eslint-disable-next-line @typescript-eslint/no-var-requires
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

import { useHistory } from "react-router-dom";
import { CurrentLocationContext } from "../../utils/currentLocationContext";
import { DataSourceContext } from "../../utils/DataSourceContext";
import socket from "../../utils/socket";

import NavigationControls from "../NavigationControls";
import SwitchLayers from "../SwitchLayers";
import Warning from "../Warning";
import { OtherShips, SocketShipData } from "../../types/types";
import getNearbyShips, { getHeadingSector } from "../../utils/getNearbyShips";

type WarningsProps = {
	nearbyShips: Array<OtherShips & { inFOV: boolean }>;
};
const Warnings: React.FC<WarningsProps> = ({ nearbyShips }) => {
	if (nearbyShips.filter((ship) => ship.inFOV).length === 1) {
		return (
			<Warning
				severity="HIGH"
				text={`You are heading towards another ship within ${
					process.env.REACT_APP_NEARBY_RADIUS || 5
				} kms.`}
			/>
		);
	}

	if (nearbyShips.length === 1) {
		return (
			<Warning
				severity="LOW"
				text={`There is another ship nearby within ${
					process.env.REACT_APP_NEARBY_RADIUS || 5
				} kms. `}
			/>
		);
	}

	if (nearbyShips.filter((ship) => ship.inFOV).length >= 2) {
		return (
			<Warning
				severity="HIGH"
				text={`You are entering a region with traffic`}
			/>
		);
	}

	if (nearbyShips.length > 1) {
		return (
			<Warning
				severity="MEDIUM"
				text={`There are multiple ships nearby within ${
					process.env.REACT_APP_NEARBY_RADIUS || 5
				}kms.`}
			/>
		);
	}
	return null;
};

const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState<any>({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [selectedShip, setSelectedShip] = useState<OtherShips | null>(null);

	const [nearbyShips, setNearbyShips] = useState<Array<
		OtherShips & { inFOV: boolean }
	> | null>(null);

	const [ships, setShips] = useState<OtherShips[]>([]);
	const shipsRef = React.useRef(ships);
	const mapRef = React.useRef<ReactMapGl>(null);
	const selectShip = (ship: OtherShips) => {
		setSelectedShip(ship);
	};

	const { location: currentLocation, setEmail, setLocation } = useContext(
		CurrentLocationContext
	);

	const windowLocation = useHistory();
	const savedEmail = localStorage.getItem("email");
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/ships`, {
				withCredentials: true,
				headers: {
					Authorization: savedEmail,
				},
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
		if (savedEmail && typeof savedEmail === "string") {
			axios
				.get(`${process.env.REACT_APP_API_URL}/api/users/current`, {
					withCredentials: true,
					headers: {
						Authorization: savedEmail,
					},
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
					localStorage.removeItem("email");
					localStorage.removeItem("name");
					windowLocation.replace("/");
				});
		} else {
			windowLocation.replace("/");
		}
	}, []);

	const { dataSource, setDataSource } = useContext(DataSourceContext);

	useEffect(() => {
		if (currentLocation) {
			setNearbyShips(getNearbyShips(ships, currentLocation));
		}
	}, [ships, currentLocation]);

	useEffect(() => {
		if (currentLocation) {
			const nearbyShipList = getNearbyShips(ships, currentLocation);
			const shipsInRadar = getNearbyShips(ships, currentLocation, 2);
			console.log({
				nearbyShips: nearbyShipList.length,
				shipsInRadar: shipsInRadar.length,
			});
			if (shipsInRadar.length > 1) {
				onEnableRadar();
			} else if (nearbyShipList.length > 0) {
				onEnableAIS();
			} else {
				onEnableSatellite();
			}
		}
	}, [currentLocation]);

	const onAisSignal = (data: SocketShipData) => {
		console.log("AIS_SIGNAL_RECEIVED", data.email);
		if (data.email) {
			const allShips = [...shipsRef.current];
			const shipIndex = allShips.findIndex((e) => e.email === data.email);
			if (shipIndex !== -1) {
				allShips[shipIndex] = {
					...allShips[shipIndex],
					latitude: data.location.latitude,
					longitude: data.location.longitude,
					heading: data.location.heading,
					speed: data.location.heading,
				};
				setShips(allShips);
			} else {
				addShip({
					email: data.email,
					heading: data.location.heading,
					speed: data.location.speed,
					latitude: data.location.latitude,
					longitude: data.location.longitude,
					name: data.name,
				});
			}
		}
	};

	const addShip = (ship: OtherShips) => {
		setShips((prevShips) => [...prevShips, ship]);
	};

	useEffect(() => {
		const handler = (data: SocketShipData) => {
			onAisSignal(data);
		};

		socket.on("AIS_SIGNAL_RECEIVED", handler);

		return () => {
			socket.off("AIS_SIGNAL_RECEIVED", handler);
		};
	}, []);

	useEffect(() => {
		shipsRef.current = ships;
	});

	const transitionDuration = 750;

	const onEnableRadar = () => {
		setViewport({
			...viewport,
			zoom: 14,
			transitionDuration,
			transitionInterpolator: new FlyToInterpolator(),
		});
		setDataSource("RADAR");
	};

	const onEnableAIS = () => {
		setDataSource("AIS");
		setViewport({
			...viewport,
			zoom: 12.125,
			transitionDuration,
			transitionInterpolator: new FlyToInterpolator(),
		});
	};

	const onEnableSatellite = () => {
		setDataSource("SATELLITE");
		setViewport({
			...viewport,
			zoom: 11.5,
			transitionDuration,
			transitionInterpolator: new FlyToInterpolator(),
		});
	};

	return (
		<div>
			<NavigationControls />
			<SwitchLayers
				onEnableAIS={onEnableAIS}
				onEnableRadar={onEnableRadar}
				onEnableSatellite={onEnableSatellite}
			/>

			{nearbyShips && <Warnings nearbyShips={nearbyShips} />}

			<ReactMapGl
				{...viewport}
				mapStyle={
					dataSource === "SATELLITE"
						? "mapbox://styles/mapbox/satellite-streets-v11"
						: "mapbox://styles/mapbox/streets-v11"
				}
				width="100vw"
				height="100vh"
				ref={mapRef}
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
									marginLeft: "-18px",
									marginTop: "-18px",
									transform: `rotate(${ship.heading}deg)`,
								}}
								src="../ShipIcon.png"
								alt={ship.email}
							/>
						</button>
					</Marker>
				))}

				{currentLocation && nearbyShips && nearbyShips.length > 0 && (
					<>
						<Source
							id="radius"
							type="geojson"
							data={{
								type: "FeatureCollection",
								features: [
									{
										type: "Feature",
										properties: {},
										geometry: {
											type: "Point",
											coordinates: [
												currentLocation.longitude,
												currentLocation.latitude,
											],
										},
									},
								],
							}}
						>
							<Layer
								id="point"
								type="circle"
								paint={{
									"circle-radius": {
										stops: [
											[0, 0],
											[
												20,
												(parseInt(
													process.env
														.REACT_APP_NEARBY_RADIUS ||
														"5"
												) *
													1000) /
													0.075 /
													Math.cos(
														(currentLocation.latitude *
															Math.PI) /
															180
													),
											],
										],
										base: 2,
									},
									"circle-color": "#007cbf",
									"circle-opacity": 0.4,
									"circle-stroke-width": 1,
								}}
							/>
						</Source>

						{/* <Source
							id="sectorSource"
							type="geojson"
							data={{
								type: "Feature",
								geometry: {
									type: "Polygon",
									coordinates: getHeadingSector(
										currentLocation
									),
								},
								properties: {},
							}}
						>
							<Layer
								id="sectorFill"
								type="fill"
								source="sectorSource"
								paint={{
									"fill-color": "red",
									"fill-opacity": 0.4,
								}}
							/>
						</Source> */}
					</>
				)}

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
								marginLeft: "-18px",
								marginTop: "-18px",
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
