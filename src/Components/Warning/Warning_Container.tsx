import React, { useContext } from "react";
import { AppConfigContext } from "../../utils/AppConfigContext";
import Warning from ".";
import { OtherShips, WarningTypes } from "../../types/types";
import { strings } from "../../utils/strings";

type WarningsProps = {
	nearbyShips: Array<OtherShips & { inFOV: boolean }>;
	playAudio: () => void;
	pauseAudio: () => void;
};
export const Warnings: React.FC<WarningsProps> = ({
	nearbyShips,
	playAudio,
	pauseAudio,
}) => {
	const { language, mute, muteType } = useContext(AppConfigContext);

	const warningSound = (type: WarningTypes, time = 2000) => {
		if (!mute && muteType !== type) {
			playAudio();
			setTimeout(() => {
				pauseAudio();
			}, time);
		}
	};

	if (nearbyShips.filter((ship) => ship.inFOV).length === 1) {
		warningSound(WarningTypes.CollisionWarning, 2000);
		return (
			<Warning
				severity="HIGH"
				type={WarningTypes.CollisionWarning}
				title={strings[language].Warning.HeadingTowardsTitle}
				text={strings[language].Warning.HeadingTowards}
			/>
		);
	}

	if (nearbyShips.length === 1) {
		warningSound(WarningTypes.NearbyShip, 1000);
		return (
			<Warning
				severity="LOW"
				type={WarningTypes.NearbyShip}
				title={strings[language].Warning.ShipNearbyTitle}
				text={strings[language].Warning.ShipNearby}
			/>
		);
	}

	if (nearbyShips.filter((ship) => ship.inFOV).length >= 2) {
		warningSound(WarningTypes.TrafficRegion, 2000);
		return (
			<Warning
				severity="HIGH"
				type={WarningTypes.TrafficRegion}
				title={strings[language].Warning.TrafficRegionTitle}
				text={strings[language].Warning.TrafficRegion}
			/>
		);
	}

	if (nearbyShips.length > 1) {
		warningSound(WarningTypes.MultipleShips, 2000);
		return (
			<Warning
				severity="MEDIUM"
				type={WarningTypes.MultipleShips}
				title={strings[language].Warning.MultipleNearbyTitle}
				text={strings[language].Warning.MultipleNearby}
			/>
		);
	}
	return null;
};
