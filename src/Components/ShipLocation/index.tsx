import React, { useContext } from "react";
import { Source, Layer, Marker } from "react-map-gl";
import { AppConfigContext } from "../../utils/AppConfigContext";

type ShipLocationProps = {
	showCircle: boolean;
};
const ShipLocation: React.FC<ShipLocationProps> = ({ showCircle }) => {
	const { radius, location: currentLocation, theme } = useContext(
		AppConfigContext
	);

	const darkTheme = theme === "dark";
	if (!currentLocation) return null;

	return (
		<>
			{showCircle && (
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
										(radius * 1000) /
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
			)}
			<Marker
				key="currentLocation"
				latitude={currentLocation.latitude}
				longitude={currentLocation.longitude}
			>
				<div
					className="bg-white dark:bg-black rounded-full flex items-center justify-center -mt-6 -ml-6 w-12 h-12 md:-mt-7 md:-ml-7 md:w-14 md:h-14"
					style={{
						transform: `rotate(${currentLocation.heading || 0}deg)`,
					}}
				>
					<img
						width={24}
						height={24}
						className="w-5 h-5 md:w-7 md:h-7 -mt-1"
						src="../CurrentLocation.svg"
						alt="Your Location"
						style={{
							filter: darkTheme ? "invert(1)" : "none",
						}}
					/>
				</div>
			</Marker>
		</>
	);
};

export default ShipLocation;
