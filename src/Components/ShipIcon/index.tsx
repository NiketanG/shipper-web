import { Marker } from "react-map-gl";
import React from "react";
import { OtherShips } from "../../types/types";

type ShipIconProps = {
	ship: OtherShips;
	selectShip: (ship: OtherShips) => void;
};
const ShipIcon: React.FC<ShipIconProps> = ({ ship, selectShip }) => {
	const select = () => selectShip(ship);
	return (
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
				onClick={select}
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
	);
};

export default ShipIcon;
