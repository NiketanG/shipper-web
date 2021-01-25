import { SIGHUP } from "constants";
import { Location, OtherShips } from "../types/types";

const degreeToRadians = (degrees: number) => {
	return degrees * (Math.PI / 180);
};

const radiansToDegree = (radians: number) => {
	return (radians * 180) / Math.PI;
};
const getDistance = (shipLocation: Location, currentLocation: Location) => {
	const radius = 6371; // Radius of earth in Kilometers
	const dLat = degreeToRadians(
		currentLocation.latitude - shipLocation.latitude
	);
	const dLong = degreeToRadians(
		currentLocation.longitude - shipLocation.longitude
	);

	const dist =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(degreeToRadians(shipLocation.latitude)) *
			Math.cos(degreeToRadians(currentLocation.latitude)) *
			Math.sin(dLong / 2) *
			Math.sin(dLong / 2);

	const distInKm =
		radius * (2 * Math.atan2(Math.sqrt(dist), Math.sqrt(1 - dist)));
	return distInKm;
};

const getAngle = (currentLocation: Location, shipLocation: Location) => {
	const pointA = {
		x: currentLocation.latitude,
		y: currentLocation.longitude,
	};

	const pointB = {
		x: shipLocation.latitude,
		y: shipLocation.longitude,
	};

	// Angle in Radians
	const angleRadians = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);

	const angle = (radiansToDegree(angleRadians) + 360) % 360;

	return angle;
};

const getNearbyShips = (
	allShips: OtherShips[],
	currentLocation: Location
): Array<OtherShips & { inFOV: boolean }> => {
	// allShips.map((ship) => {
	// 	console.log(
	// 		`[Angle] ${ship.email} ${getAngle(
	// 			currentLocation,
	// 			ship
	// 		)}, [Heading] ${currentLocation.heading}`
	// 	);
	// });
	return allShips
		.filter(
			(ship) =>
				getDistance(ship, currentLocation) <
				parseInt(process.env.REACT_APP_NEARBY_RADIUS || "5")
		)
		.map((ship) => {
			const angle = getAngle(currentLocation, ship);
			const angleRange = parseInt(
				process.env.REACT_APP_NEARBY_ANGLE || "35"
			);

			const angleDiff =
				((currentLocation.heading - angle + 180 + 360) % 360) - 180;
			return {
				...ship,
				inFOV: angleDiff >= -angleRange && angleDiff <= angleRange,
			};
		});
};

export default getNearbyShips;
