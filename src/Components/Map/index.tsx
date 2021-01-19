import React, { useState } from "react";
import ReactMapGl from "react-map-gl";

const Map: React.FC<any> = () => {
	const [viewport, setViewport] = useState({
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
		zoom: 13,
	});
	return (
		<div>
			<ReactMapGl
				{...viewport}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				width="100vw"
				height="100vh"
				onViewportChange={(viewport) => {
					console.log(viewport);
					setViewport(viewport);
				}}
			/>
			{/* <Warning /> */}
		</div>
	);
};

export default Map;
