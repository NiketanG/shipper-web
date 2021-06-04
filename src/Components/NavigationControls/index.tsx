import React, { useContext } from "react";
import { AppConfigContext } from "../../utils/AppConfigContext";
import socket from "../../utils/socket";

type Props = {
	setViewport: ({
		latitude,
		longitude,
	}: {
		latitude: number;
		longitude: number;
	}) => void;
};
const NavigationControls: React.FC<Props> = ({ setViewport }) => {
	const { theme, location, email, setLocation, speed } = useContext(
		AppConfigContext
	);
	const savedName = localStorage.getItem("name");

	const goForward = () => {
		if (location) {
			const newLocation = {
				...location,
				latitude: location.latitude + speed,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
			setViewport({
				latitude: newLocation.latitude,
				longitude: newLocation.longitude,
			});
		}
	};

	const goBackward = () => {
		if (location) {
			const newLocation = {
				...location,
				latitude: location.latitude - speed,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
			setViewport({
				latitude: newLocation.latitude,
				longitude: newLocation.longitude,
			});
		}
	};

	const goLeft = () => {
		if (location) {
			const newLocation = {
				...location,
				longitude: location.longitude - speed,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
			setViewport({
				latitude: newLocation.latitude,
				longitude: newLocation.longitude,
			});
		}
	};

	const goRight = () => {
		if (location) {
			const newLocation = {
				...location,
				longitude: location.longitude + speed,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
			setViewport({
				latitude: newLocation.latitude,
				longitude: newLocation.longitude,
			});
		}
	};

	const rotateLeft = () => {
		if (location) {
			const newLocation = {
				...location,
			};
			if (location.heading - 10 <= 0) {
				newLocation.heading = 360;
				socket.emit("AIS_SIGNAL_EMIT", {
					email,
					name: savedName || "",
					location: newLocation,
				});
				setLocation({
					...newLocation,
				});
				setViewport({
					latitude: newLocation.latitude,
					longitude: newLocation.longitude,
				});
			} else {
				newLocation.heading = location.heading - 10;
				socket.emit("AIS_SIGNAL_EMIT", {
					email,
					name: savedName || "",
					location: newLocation,
				});
				setLocation({
					...newLocation,
				});
				setViewport({
					latitude: newLocation.latitude,
					longitude: newLocation.longitude,
				});
			}
		}
	};

	const rotateRight = () => {
		if (location) {
			const newLocation = {
				...location,
			};
			if (location.heading + 10 >= 360) {
				newLocation.heading = 0;
				socket.emit("AIS_SIGNAL_EMIT", {
					email,
					name: savedName || "",
					location: newLocation,
				});
				setLocation({
					...newLocation,
					heading: 0,
				});
				setViewport({
					latitude: newLocation.latitude,
					longitude: newLocation.longitude,
				});
			} else {
				newLocation.heading = location.heading + 10;
				socket.emit("AIS_SIGNAL_EMIT", {
					email,
					name: savedName || "",
					location: newLocation,
				});
				setLocation({
					...newLocation,
				});
				setViewport({
					latitude: newLocation.latitude,
					longitude: newLocation.longitude,
				});
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center z-10 absolute left-4 bottom-24 md:bottom-32">
			<div className="flex flex-row">
				<img
					onClick={rotateLeft}
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
					}}
					src="/RotateLeft.png"
					alt="Rotate Left"
				/>
				<img
					onClick={goForward}
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
					}}
					src="/Up.png"
					alt="Up"
				/>
				<img
					onClick={rotateRight}
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
					}}
					src="/RotateRight.png"
					alt="Rotate Right"
				/>
			</div>
			<div className="flex flex-row">
				<img
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
					}}
					src="/Left.png"
					alt="Left"
					onClick={goLeft}
				/>
				<img
					onClick={goBackward}
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
						transform: "rotate(180deg)",
					}}
					src="/Up.png"
					alt="Down"
				/>

				<img
					onClick={goRight}
					className="bg-white rounded p-2 w-7 h-7"
					style={{
						filter: theme === "dark" ? "invert(1)" : "none",
						margin: "2px",
					}}
					src="/Right.png"
					alt="Right"
				/>
			</div>
		</div>
	);
};

export default NavigationControls;
