import React, { useContext } from "react";
import { FlyToInterpolator } from "react-map-gl";
import useMedia from "use-media";
import { NearbyShip, OtherShips } from "../../types/types";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { strings } from "../../utils/strings";

type NearbyShipsProps = {
	selectedShip: OtherShips | null;
	nearbyShips: NearbyShip[] | null;
	viewport: any;
	setViewport: (value: any) => void;
	setShowNearbyShips: (value: React.SetStateAction<boolean>) => void;
	previousViewport: any;
	setSelectedShip: (value: React.SetStateAction<OtherShips | null>) => void;
	setPreviousViewport: (value: React.SetStateAction<any>) => void;
};
const NearbyShips: React.FC<NearbyShipsProps> = ({
	nearbyShips,
	previousViewport,
	selectedShip,
	setShowNearbyShips,
	setViewport,
	viewport,
	setPreviousViewport,
	setSelectedShip,
}) => {
	const { language } = useContext(AppConfigContext);
	const isMobile = useMedia({ maxWidth: "640px" });

	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<p className="font-semibold text-xl md:text-2xl">
					{strings[language].Info.NearbyShips}
				</p>
				<img
					onClick={() => {
						setShowNearbyShips(false);

						if (selectedShip && previousViewport) {
							setViewport({
								...viewport,
								...previousViewport,
								transitionDuration: 500,
								transitionInterpolator: new FlyToInterpolator(),
							});
						}
					}}
					className="cursor-pointer"
					src="Close.svg"
					alt="Close"
					width={28}
					height={28}
				/>
			</div>
			<div className="flex flex-col my-6">
				{nearbyShips?.map((ship) => (
					<div
						key={ship.email}
						onClick={() => {
							setShowNearbyShips(false);
							setPreviousViewport(viewport);
							setSelectedShip(ship);
							setViewport({
								...viewport,
								zoom: 14,
								latitude: ship.latitude,
								longitude: ship.longitude,
								transitionDuration: 500,
								transitionInterpolator: new FlyToInterpolator(),
							});
						}}
					>
						<div
							className="flex flex-col cursor-pointer transition  hover:bg-gray-100 rounded pb-4 pt-2 px-8"
							style={{
								width: isMobile ? innerWidth : 448,
								marginLeft: -32,
							}}
						>
							<p className="text-base md:text-xl font-medium">
								{ship.email}
							</p>
							<p className="text-sm md:text-base opacity-80">
								{ship.name}
							</p>
							<p className="text-sm md:text-base font-medium opacity-80">
								{strings[language].Info.Distance}
								{" : "}
								{ship.distance.toFixed(2)} Kms
							</p>
						</div>
						<div className="bg-black opacity-40 w-full h-px mx-auto  mb-4" />
					</div>
				))}
			</div>
		</>
	);
};

export default NearbyShips;
