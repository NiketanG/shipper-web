import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import ReactMapGl, {
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
import {
	CurrentLocationContext,
	Languages,
	LanguagesList,
} from "../../utils/currentLocationContext";
import { DataSourceContext } from "../../utils/DataSourceContext";
import socket from "../../utils/socket";

import NavigationControls from "../NavigationControls";
import SwitchLayers from "../SwitchLayers";
import Warning from "../Warning";
import { OtherShips, SocketShipData } from "../../types/types";
import getNearbyShips, {
	getHeadingSector,
	getNearbyPirates,
} from "../../utils/getNearbyShips";
import { strings } from "../../utils/strings";
// import warningSound from "../Map/Warning.mp3";

type WarningsProps = {
	nearbyShips: Array<OtherShips & { inFOV: boolean }>;
};
const Warnings: React.FC<WarningsProps> = ({ nearbyShips }) => {
	const { language } = useContext(CurrentLocationContext);

	// const [playing, toggle] = useAudio(warningSound);

	if (nearbyShips.filter((ship) => ship.inFOV).length === 1) {
		// alert(typeof toggle);
		// if (!playing && typeof toggle === "function") {
		// 	toggle();
		// }
		return (
			<Warning
				severity="HIGH"
				text={strings[language].Warning.HeadingTowards}
			/>
		);
	}

	if (nearbyShips.length === 1) {
		return (
			<Warning
				severity="LOW"
				text={strings[language].Warning.ShipNearby}
			/>
		);
	}

	if (nearbyShips.filter((ship) => ship.inFOV).length >= 2) {
		return (
			<Warning
				severity="HIGH"
				text={strings[language].Warning.TrafficRegion}
			/>
		);
	}

	if (nearbyShips.length > 1) {
		return (
			<Warning
				severity="MEDIUM"
				text={strings[language].Warning.MultipleNearby}
			/>
		);
	}
	return null;
};

const useAudio = (url: string) => {
	const [audio] = useState(new Audio(url));
	const [playing, setPlaying] = useState(false);

	const toggle = () => {
		setPlaying(!playing);
	};

	useEffect(() => {
		playing ? audio.play() : audio.pause();
	}, [playing]);

	useEffect(() => {
		audio.addEventListener("ended", () => {
			setPlaying(false);
		});
		return () => {
			audio.removeEventListener("ended", () => {
				setPlaying(false);
			});
		};
	}, []);

	return [playing, toggle];
};
type PirateSignals = {
	latitude: number;
	longitude: number;
};
const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState<any>({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [showPirateSelector, setShowPirateSelector] = useState(false);

	const [selectedShip, setSelectedShip] = useState<OtherShips | null>(null);

	const [nearbyShips, setNearbyShips] = useState<Array<
		OtherShips & { inFOV: boolean }
	> | null>(null);

	const [pirateSignals, setPirateSignals] = useState<PirateSignals[] | null>(
		null
	);

	const [pirateLocation, setPirateLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const [ships, setShips] = useState<OtherShips[]>([]);
	const shipsRef = React.useRef(ships);
	const piratesRef = React.useRef(pirateSignals);
	const mapRef = React.useRef<ReactMapGl>(null);
	const selectShip = (ship: OtherShips) => {
		setSelectedShip(ship);
	};

	const {
		location: currentLocation,
		setEmail,
		setLocation,
		language,
		setLanguage,
	} = useContext(CurrentLocationContext);

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
			if (shipsInRadar.length > 1) {
				onEnableRadar();
			} else if (nearbyShipList.length > 0) {
				onEnableAIS();
			} else {
				onEnableSatellite();
			}
		}
	}, [currentLocation]);

	const [pirateNearby, setPirateNearby] = useState(false);
	useEffect(() => {
		if (currentLocation && pirateSignals) {
			const nearbyPirates = getNearbyPirates(
				pirateSignals,
				currentLocation,
				3
			);
			if (nearbyPirates.length > 0) {
				setPirateNearby(true);
			} else {
				setPirateNearby(false);
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
		piratesRef.current = pirateSignals;
	});

	const onPirateSignal = (data: PirateSignals) => {
		if (piratesRef.current) {
			setPirateSignals([...piratesRef.current, data]);
		} else {
			setPirateSignals([data]);
		}
	};

	useEffect(() => {
		const handler = (data: PirateSignals) => {
			onPirateSignal(data);
		};

		socket.on("NEW_PIRATE_SIGNAL", handler);

		return () => {
			socket.off("NEW_PIRATE_SIGNAL", handler);
		};
	}, []);

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
			<select
				id="languages"
				name="languages"
				style={{
					position: "absolute",
					right: 16,
					bottom: 16,
					zIndex: 10,
				}}
				onChange={(e) => {
					setLanguage(e.target.value as Languages);
				}}
			>
				{LanguagesList.map((lang, i) => (
					<option
						selected={language === lang.value}
						value={lang.value}
						key={lang.value}
					>
						{lang.label}
					</option>
				))}
			</select>
			{pirateNearby && (
				<div
					style={{
						width: "50%",
						backgroundColor: "#F42C2C",
						position: "absolute",
						bottom: 72,
						left: 0,
						borderRadius: 4,
						transform: "translateX(50%)",
						padding: "8px 16px",
						color: "white",
						zIndex: 10,
						marginBottom: 16,
					}}
				>
					{strings[language].Warning.PirateWarn}
				</div>
			)}
			{showPirateSelector ? (
				<>
					<div
						style={{
							width: "50%",
							backgroundColor: "white",
							color: "black",
							position: "absolute",
							top: 16,
							left: 0,
							borderRadius: 4,
							transform: "translateX(50%)",
							padding: "8px 16px",
							zIndex: 10,
							marginBottom: 16,
						}}
					>
						{strings[language].Info.SelectPirate}
						{/* Click on the location of suspicious ship */}
					</div>

					<div
						onClick={() => {
							if (pirateLocation) {
								socket.emit("NEW_PIRATE", pirateLocation);
								if (pirateSignals) {
									setPirateSignals([
										...pirateSignals,
										pirateLocation,
									]);
								} else {
									setPirateSignals([pirateLocation]);
								}
								setShowPirateSelector(false);
							}
						}}
						style={{
							cursor: "pointer",
							backgroundColor: "white",
							color: "black",
							padding: "8px",
							borderRadius: "4px",
							position: "absolute",
							top: "16px",
							right: "16px",
							zIndex: 10,
							textAlign: "right",
						}}
					>
						{strings[language].Info.Report}
					</div>

					<div
						onClick={() => {
							setShowPirateSelector(false);
						}}
						style={{
							cursor: "pointer",
							backgroundColor: "white",
							color: "red",
							padding: "8px",
							borderRadius: "4px",
							position: "absolute",
							top: "64px",
							right: "16px",
							zIndex: 10,
							textAlign: "right",
						}}
					>
						{strings[language].Info.Close}
					</div>
				</>
			) : (
				<>
					<div
						onClick={() => {
							setShowPirateSelector(true);
						}}
						style={{
							cursor: "pointer",
							backgroundColor: "white",
							color: "red",
							padding: "8px",
							borderRadius: "4px",
							position: "absolute",
							top: "16px",
							right: "16px",
							zIndex: 10,
							textAlign: "right",
						}}
					>
						{strings[language].Info.ReportPirate}
					</div>

					<NavigationControls
						setViewport={({ latitude, longitude }) => {
							setViewport({
								...viewport,
								latitude,
								longitude,
							});
						}}
					/>

					<SwitchLayers
						onEnableAIS={onEnableAIS}
						onEnableRadar={onEnableRadar}
						onEnableSatellite={onEnableSatellite}
					/>

					{nearbyShips && <Warnings nearbyShips={nearbyShips} />}
				</>
			)}

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
				onClick={(e) => {
					if (showPirateSelector) {
						setPirateLocation({
							latitude: e.lngLat[1],
							longitude: e.lngLat[0],
						});
					}
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

				{showPirateSelector &&
					pirateLocation?.latitude &&
					pirateLocation?.longitude && (
						<>
							<Marker
								key="pirateSelector"
								latitude={pirateLocation?.latitude}
								longitude={pirateLocation?.longitude}
							>
								<div
									style={{
										width: "12px",
										zIndex: 10,
										height: "12px",
										marginLeft: "-6px",
										marginTop: "-6px",
										backgroundColor: "red",
										borderRadius: "12px",
									}}
								/>
							</Marker>

							<Source
								id="pirateRadius"
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
													pirateLocation.longitude,

													pirateLocation.latitude,
												],
											},
										},
									],
								}}
							>
								<Layer
									id="piratePointSelection"
									type="circle"
									paint={{
										"circle-radius": {
											stops: [
												[0, 0],
												[
													20,
													(2 * 1000) /
														0.075 /
														Math.cos(
															(pirateLocation.latitude *
																Math.PI) /
																180
														),
												],
											],
											base: 2,
										},
										"circle-color": "red",
										"circle-opacity": 0.2,
										"circle-stroke-width": 1,
									}}
								/>
							</Source>
						</>
					)}

				{pirateSignals && pirateSignals.length > 0 && (
					<>
						{pirateSignals.map((pirate, i) => (
							<Marker
								key={`pirate${i}`}
								latitude={pirate.latitude}
								longitude={pirate.longitude}
							>
								<div
									style={{
										width: "12px",
										zIndex: 10,
										height: "12px",
										marginLeft: "-6px",
										marginTop: "-6px",
										backgroundColor: "red",
										borderRadius: "12px",
									}}
								/>
							</Marker>
						))}

						<Source
							id="pirateSignalsRadius"
							type="geojson"
							data={{
								type: "FeatureCollection",
								features: pirateSignals.map((pirate) => {
									return {
										type: "Feature",
										properties: {},
										geometry: {
											type: "Point",
											coordinates: [
												pirate.longitude,
												pirate.latitude,
											],
										},
									};
								}),
							}}
						>
							{pirateSignals.map((pirate, i) => (
								<Layer
									key={`pirateRadius${i}`}
									id={`pirateRadius${i}`}
									type="circle"
									paint={{
										"circle-radius": {
											stops: [
												[0, 0],
												[
													20,
													(2 * 1000) /
														0.075 /
														Math.cos(
															(pirate.latitude *
																Math.PI) /
																180
														),
												],
											],
											base: 2,
										},
										"circle-color": "red",
										"circle-opacity": 0.2,
										"circle-stroke-width": 1,
									}}
								/>
							))}
						</Source>
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
						<div>
							{strings[language].Info.Email}: {selectedShip.email}
							<br />
							{strings[language].Info.Name}: {selectedShip.name}
							<br />
							{strings[language].Info.Speed}: {selectedShip.speed}
						</div>
					</Popup>
				)}
			</ReactMapGl>
		</div>
	);
};

export default Map;
