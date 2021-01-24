import React, { useContext } from "react";
import { CurrentLocationContext } from "../../utils/currentLocationContext";
import socket from "../../utils/socket";

const NavigationControls: React.FC<any> = () => {
	const { location, email, setLocation } = useContext(CurrentLocationContext);
	const savedName = localStorage.getItem("name");

	const goForward = () => {
		if (location) {
			const newLocation = {
				...location,
				latitude: location.latitude + 0.0005,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
		}
	};

	const goBackward = () => {
		if (location) {
			const newLocation = {
				...location,
				latitude: location.latitude - 0.0005,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
		}
	};

	const goLeft = () => {
		if (location) {
			const newLocation = {
				...location,
				longitude: location.longitude - 0.0005,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
			});
		}
	};

	const goRight = () => {
		if (location) {
			const newLocation = {
				...location,
				longitude: location.longitude + 0.0005,
			};
			socket.emit("AIS_SIGNAL_EMIT", {
				email,
				name: savedName || "",
				location: newLocation,
			});
			setLocation({
				...newLocation,
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
			}
		}
	};

	return (
		<div
			style={{
				position: "absolute",
				bottom: 16,
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
