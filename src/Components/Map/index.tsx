import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import ReactMapGl, {
	Marker,
	Source,
	Layer,
	FlyToInterpolator,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";

// eslint-disable-next-line @typescript-eslint/no-var-requires
(mapboxgl as any).workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

import { useHistory } from "react-router-dom";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { DataSourceContext } from "../../utils/DataSourceContext";
import socket from "../../utils/socket";

import NavigationControls from "../NavigationControls";
import SwitchLayers from "../SwitchLayers";
import {
	NearbyShip,
	OtherShips,
	PirateSignals,
	SocketShipData,
	WarningTypes,
} from "../../types/types";
import getNearbyShips, {
	getDistance,
	getNearbyPirates,
} from "../../utils/getNearbyShips";
import { strings } from "../../utils/strings";
import { Warnings } from "../Warning/Warning_Container";
import BottomBar from "../BottomBar";
import Warning from "../Warning";
import PirateSelector from "../PirateSelector/index";
import SlideInModal from "../SlideInModal";
import NavigationGuide from "../NavigationGuide";

const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState<any>({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [previousViewport, setPreviousViewport] = useState({});

	const [showPirateSelector, setShowPirateSelector] = useState(false);

	const [selectedShip, setSelectedShip] = useState<OtherShips | null>(null);

	const [nearbyShips, setNearbyShips] = useState<Array<NearbyShip> | null>(
		null
	);

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
		showGuide,
	} = useContext(AppConfigContext);

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
				2.5
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

	const transitionDuration = 500;

	const onEnableRadar = () => {
		setViewport({
			...viewport,
			latitude: currentLocation?.latitude,
			longitude: currentLocation?.longitude,
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
			latitude: currentLocation?.latitude,
			longitude: currentLocation?.longitude,
			zoom: 12.125,
			transitionDuration,
			transitionInterpolator: new FlyToInterpolator(),
		});
	};

	const onEnableSatellite = () => {
		setDataSource("SATELLITE");
		setViewport({
			...viewport,
			latitude: currentLocation?.latitude,
			longitude: currentLocation?.longitude,
			zoom: 11.5,
			transitionDuration,
			transitionInterpolator: new FlyToInterpolator(),
		});
	};

	const audioRef = React.useRef<HTMLAudioElement>(null);

	const playAudio = () => {
		audioRef?.current?.play();
	};

	const pauseAudio = () => {
		audioRef?.current?.pause();
	};

	const [showNearbyShips, setShowNearbyShips] = useState(false);
	const [showControls, setShowControls] = useState(true);

	const addPirate = () => {
		if (pirateLocation) {
			socket.emit("NEW_PIRATE", pirateLocation);
			if (pirateSignals) {
				setPirateSignals([...pirateSignals, pirateLocation]);
			} else {
				setPirateSignals([pirateLocation]);
			}
			setShowPirateSelector(false);
		}
	};
	return (
		<div>
			<audio
				style={{
					position: "absolute",
					right: 16,
					bottom: 16,
					zIndex: 10,
				}}
				ref={audioRef}
				src={`${process.env.PUBLIC_URL}/Warning.mp3`}
				id="warningAudioPlayer"
				className="warningAudioPlayer"
			></audio>

			<SlideInModal open={showNearbyShips || selectedShip !== null}>
				{showNearbyShips ? (
					<>
						<div className="flex flex-row justify-between items-center">
							<p className="font-medium text-2xl">
								{strings[language].Info.NearbyShips}
							</p>
							<img
								onClick={() => {
									setShowNearbyShips(false);
									if (previousViewport) {
										setViewport({
											...previousViewport,
											transitionDuration: 500,
											transitionInterpolator: new FlyToInterpolator(),
										});
									}
								}}
								className="cursor-pointer"
								src="Close.svg"
								alt="Close"
								width={28}
								height={28}
							/>
						</div>
						<div className="flex flex-col my-6">
							{nearbyShips?.map((ship) => (
								<div
									key={ship.email}
									onClick={() => {
										setPreviousViewport(viewport);
										setViewport({
											...viewport,
											zoom: 14,
											latitude: ship.latitude,
											longitude: ship.longitude,
											transitionDuration: 500,
											transitionInterpolator: new FlyToInterpolator(),
										});
									}}
								>
									<div className="flex flex-col">
										<p className="text-xl font-medium">
											{ship.email}
										</p>
										<p className="opacity-80">
											{ship.name}
										</p>
										<p className="font-medium opacity-80">
											{strings[language].Info.Distance}
											{" : "}
											{ship.distance.toFixed(2)} Kms
										</p>
									</div>
									<div className="bg-black opacity-40 w-full h-px mx-auto my-4" />
								</div>
							))}
						</div>
					</>
				) : selectedShip ? (
					<>
						<div className="flex flex-row justify-between items-center">
							<p className="font-medium text-2xl">
								{strings[language].Info.SelectedShip}
							</p>
							<img
								className="cursor-pointer"
								onClick={() => {
									setSelectedShip(null);
								}}
								src="Close.svg"
								alt="Close"
								width={28}
								height={28}
							/>
						</div>
						<div className="flex flex-col my-6">
							<p>{strings[language].Info.Email}</p>
							<p className="text-xl font-medium">
								{selectedShip.email}
							</p>
							<p className="mt-4">
								{strings[language].Info.Name}
							</p>

							<p className="text-xl font-medium">
								{selectedShip.name}
							</p>
							<p className="mt-4">
								{strings[language].Info.Distance || "Distance"}
							</p>
							<p className="text-xl font-medium">
								{currentLocation &&
									`${getDistance(
										selectedShip,
										currentLocation
									).toFixed(2)} Kms`}
							</p>
						</div>
					</>
				) : null}
			</SlideInModal>

			<BottomBar
				controlsShown={showControls}
				toggleControls={() => setShowControls(!showControls)}
				nearbyShipsShown={showNearbyShips}
				toggleNearbyShips={() => setShowNearbyShips(!showNearbyShips)}
				pirateSelectorShown={showPirateSelector}
				togglePirateSelector={() =>
					setShowPirateSelector(!showPirateSelector)
				}
			/>
			{pirateNearby && (
				<div
					style={{
						zIndex: 11,
					}}
				>
					<Warning
						severity="HIGH"
						type={WarningTypes.UnidentifiedShip}
						title={strings[language].Warning.PirateWarnTitle}
						text={strings[language].Warning.PirateWarn}
					/>
				</div>
			)}
			{showPirateSelector ? (
				<PirateSelector
					addPirate={addPirate}
					closePirateSelector={() => setShowPirateSelector(false)}
				/>
			) : (
				<>
					{showControls && (
						<NavigationControls
							setViewport={({ latitude, longitude }) => {
								setViewport({
									...viewport,
									latitude,
									longitude,
								});
							}}
						/>
					)}
					<SwitchLayers
						onEnableAIS={onEnableAIS}
						onEnableRadar={onEnableRadar}
						onEnableSatellite={onEnableSatellite}
					/>

					{!pirateNearby && nearbyShips && (
						<Warnings
							nearbyShips={nearbyShips}
							playAudio={playAudio}
							pauseAudio={pauseAudio}
						/>
					)}
				</>
			)}

			{showGuide && <NavigationGuide nearbyShips={nearbyShips} />}

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
								marginLeft: "-28px",
								marginTop: "-28px",
							}}
							onClick={() => selectShip(ship)}
						>
							<img
								width={32}
								height={32}
								style={{
									width: 56,
									height: 56,
									transform: `rotate(${ship.heading}deg)`,
								}}
								src="../ShipIcon.png"
								alt={ship.email}
							/>
						</button>
					</Marker>
				))}

				{showPirateSelector &&
					pirateLocation?.latitude &&
					pirateLocation?.longitude && (
						<>
							<Marker
								key="pirateSelector"
								latitude={pirateLocation?.latitude}
								longitude={pirateLocation?.longitude}
							>
								<img
									style={{
										width: "36px",
										height: "36px",
										marginLeft: "-18px",
										marginTop: "-18px",
									}}
									src="/Warning.svg"
									alt="Pirate Ship"
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
													(2.5 * 1000) /
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
								<img
									width={36}
									height={36}
									style={{
										marginLeft: "-12px",
										marginTop: "-12px",
									}}
									src="/Warning.svg"
									alt="Pirate Ship"
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
													(2.5 * 1000) /
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
						<div
							className="bg-white rounded-full flex items-center justify-center"
							style={{
								width: "56px",
								height: "56px",
								marginLeft: "-28px",
								marginTop: "-28px",
							}}
						>
							<img
								width={24}
								height={24}
								style={{
									transform: `rotate(${
										currentLocation.heading || 0
									}deg)`,
								}}
								src="../CurrentLocation.svg"
								alt="Your Location"
							/>
						</div>
					</Marker>
				)}
			</ReactMapGl>
		</div>
	);
};

export default Map;
