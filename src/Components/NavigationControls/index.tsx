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
	const { location, email, setLocation, speed } = useContext(
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
		<div
			style={{
				position: "absolute",
				bottom: 112,
				left: 16,
				zIndex: 10,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<img
					onClick={rotateLeft}
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						borderRadius: "4px",
						margin: "2px",
					}}
					src="/RotateLeft.png"
					alt="Rotate Left"
				/>
				<img
					onClick={goForward}
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						borderRadius: "4px",
						margin: "2px",
					}}
					src="/Up.png"
					alt="Up"
				/>
				<img
					onClick={rotateRight}
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						borderRadius: "4px",
						margin: "2px",
					}}
					src="/RotateRight.png"
					alt="Rotate Right"
				/>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<img
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						borderRadius: "4px",
						margin: "2px",
					}}
					src="/Left.png"
					alt="Left"
					onClick={goLeft}
				/>
				<img
					onClick={goBackward}
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						transform: "rotate(180deg)",
						borderRadius: "4px",
						margin: "2px",
					}}
					src="/Up.png"
					alt="Down"
				/>

				<img
					onClick={goRight}
					style={{
						backgroundColor: "white",
						color: "red",
						width: "28px",
						height: "28px",
						padding: "8px",
						borderRadius: "4px",
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
