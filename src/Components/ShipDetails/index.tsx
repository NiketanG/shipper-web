import React, { useContext } from "react";
import { FlyToInterpolator } from "react-map-gl";
import { OtherShips } from "../../types/types";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { getDistance } from "../../utils/getNearbyShips";
import { strings } from "../../utils/strings";

type ShipProps = {
	selectedShip: OtherShips;
	viewport: any;
	previousViewport: any;
	setSelectedShip: (value: React.SetStateAction<OtherShips | null>) => void;
	setViewport: (value: any) => void;
};

const SelectedShip: React.FC<ShipProps> = ({
	selectedShip,
	previousViewport,
	viewport,
	setSelectedShip,
	setViewport,
}) => {
	const { language, location } = useContext(AppConfigContext);

	const closeModal = () => {
		if (selectedShip && previousViewport) {
			setSelectedShip(null);
			setViewport({
				...viewport,
				...previousViewport,
				transitionDuration: 500,
				transitionInterpolator: new FlyToInterpolator(),
			});
		}
	};

	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<p className="font-semibold text-xl md:text-2xl">
					{strings[language].Info.SelectedShip}
				</p>
				<img
					className="cursor-pointer"
					onClick={closeModal}
					src="Close.svg"
					alt="Close"
					width={28}
					height={28}
				/>
			</div>
			<div className="flex flex-col my-6">
				<p className="text-sm md:text-base">
					{strings[language].Info.Email}
				</p>
				<p className="text-base md:text-xl font-medium">
					{selectedShip.email}
				</p>
				<p className="mt-4 text-sm md:text-base">
					{strings[language].Info.Name}
				</p>

				<p className="text-base md:text-xl font-medium">
					{selectedShip.name}
				</p>
				<p className="mt-4 text-sm md:text-base">
					{strings[language].Info.Distance || "Distance"}
				</p>
				<p className="text-base md:text-xl font-medium">
					{location &&
						`${getDistance(selectedShip, location).toFixed(2)} Kms`}
				</p>
			</div>
		</>
	);
};

export default SelectedShip;
