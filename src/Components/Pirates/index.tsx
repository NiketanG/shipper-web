import React from "react";
import { PirateSignals } from "../../types/types";
import { Marker, Source, Layer } from "react-map-gl";

type PiratesProps = {
	pirateSignals: PirateSignals[] | null;
};
const Pirates: React.FC<PiratesProps> = ({ pirateSignals }) => {
	if (!pirateSignals) return null;
	return (
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
												(pirate.latitude * Math.PI) /
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
	);
};

export default Pirates;
