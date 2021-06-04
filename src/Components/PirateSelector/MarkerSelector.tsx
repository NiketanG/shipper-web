import React from "react";
import { Marker, Source, Layer } from "react-map-gl";
type MarkerProps = {
	pirateLocation: {
		latitude: number;
		longitude: number;
	} | null;
};

const MarkerSelector: React.FC<MarkerProps> = ({ pirateLocation }) => {
	if (!pirateLocation) return null;
	return (
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
	);
};

export default MarkerSelector;
