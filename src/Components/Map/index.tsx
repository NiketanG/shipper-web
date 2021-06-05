import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import ReactMapGl, { FlyToInterpolator } from "react-map-gl";
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
import getNearbyShips, { getNearbyPirates } from "../../utils/getNearbyShips";
import { strings } from "../../utils/strings";
import { Warnings } from "../Warning/Warning_Container";
import BottomBar from "../BottomBar";
import Warning from "../Warning";
import PirateSelector from "../PirateSelector";
import SlideInModal from "../SlideInModal";
import NavigationGuide from "../NavigationGuide";
import SelectedShip from "../ShipDetails";
import NearbyShips from "../NearbyShips";
import Pirates from "../Pirates";
import MarkerSelector from "../PirateSelector/MarkerSelector";
import ShipLocation from "../ShipLocation";
import ShipIcon from "../ShipIcon";

const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState<any>({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});

	const [previousViewport, setPreviousViewport] = useState({});

	const signOut = () => {
		localStorage.removeItem("name");
		localStorage.removeItem("email");
		windowLocation.replace("/");
	};

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
	const selectShip = (ship: OtherShips) => setSelectedShip(ship);

	const {
		location: currentLocation,
		theme,
		setEmail,
		setLocation,
		language,
		showGuide,
	} = useContext(AppConfigContext);

	const darkTheme = theme === "dark";

	const windowLocation = useHistory();
	const savedEmail = localStorage.getItem("email");

	const fetchShips = async () => {
		try {
			const res = await axios.get(
				`${process.env.REACT_APP_API_URL}/ships`,
				{
					withCredentials: true,
					headers: {
						Authorization: savedEmail,
					},
				}
			);
			if (res.status === 200) setShips(res.data);
		} catch (err) {
			alert("An error occured");
			console.error(err);
		}
	};

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
						fetchShips();
					}
				})
				.catch((err) => {
					console.error(err);
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
		if (currentLocation)
			setNearbyShips(getNearbyShips(ships, currentLocation));
	}, [ships, currentLocation]);

	// Auto Switch Data Source based on No. of ships nearby
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

	// Check if there are unidentified ships nearby & show warning
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

	const addShip = (ship: OtherShips) =>
		setShips((prevShips) => [...prevShips, ship]);

	useEffect(() => {
		const handler = (data: SocketShipData) => onAisSignal(data);
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
		const handler = (data: PirateSignals) => onPirateSignal(data);
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

	const playAudio = () => audioRef?.current?.play();

	const pauseAudio = () => audioRef?.current?.pause();

	const [showNearbyShips, setShowNearbyShips] = useState(false);
	const [showControls, setShowControls] = useState(true);

	const openSettings = () => windowLocation.replace("/settings");

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

			<SlideInModal open={showNearbyShips || selectedShip !== null}>
				{showNearbyShips ? (
					<NearbyShips
						nearbyShips={nearbyShips}
						previousViewport={previousViewport}
						selectedShip={selectedShip}
						setPreviousViewport={setPreviousViewport}
						setSelectedShip={setSelectedShip}
						setShowNearbyShips={setShowNearbyShips}
						setViewport={setViewport}
						viewport={viewport}
					/>
				) : selectedShip ? (
					<SelectedShip
						selectedShip={selectedShip}
						viewport={viewport}
						previousViewport={previousViewport}
						setSelectedShip={setSelectedShip}
						setViewport={setViewport}
					/>
				) : null}
			</SlideInModal>

			{pirateNearby && (
				<Warning
					severity="HIGH"
					type={WarningTypes.UnidentifiedShip}
					title={strings[language].Warning.PirateWarnTitle}
					text={strings[language].Warning.PirateWarn}
				/>
			)}

			{showPirateSelector ? (
				<PirateSelector
					addPirate={addPirate}
					closePirateSelector={() => setShowPirateSelector(false)}
				/>
			) : (
				<>
					<img
						src="/Logout.png"
						alt="Logout"
						width={36}
						height={36}
						className="cursor-pointer rounded absolute top-0 right-0 z-20 mr-4 mt-4 bg-white p-2"
						onClick={signOut}
						style={{
							filter: darkTheme ? "invert(1)" : "none",
						}}
					/>
					<img
						src="/Settings.svg"
						alt="Settings"
						width={36}
						height={36}
						className="cursor-pointer rounded absolute top-8 right-0 z-20 mr-4 mt-4 bg-white p-2"
						onClick={openSettings}
						style={{
							filter: darkTheme ? "invert(1)" : "none",
						}}
					/>
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
						: `mapbox://styles/mapbox/${
								theme === "light" ? "streets-v11" : "dark-v10"
						  }`
				}
				width="100vw"
				height={window.innerHeight}
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
				{showPirateSelector && (
					<MarkerSelector pirateLocation={pirateLocation} />
				)}
				{ships?.map((ship) => (
					<ShipIcon
						selectShip={(value) => selectShip(value)}
						ship={ship}
						key={ship.email}
					/>
				))}

				{pirateSignals && pirateSignals.length > 0 && (
					<Pirates pirateSignals={pirateSignals} />
				)}

				<ShipLocation
					showCircle={nearbyShips !== null && nearbyShips.length > 0}
				/>
			</ReactMapGl>
		</div>
	);
};

export default Map;
