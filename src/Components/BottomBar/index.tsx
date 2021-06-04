import React, { useContext } from "react";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { strings } from "../../utils/strings";

type Props = {
	controlsShown: boolean;
	toggleControls: () => void;

	nearbyShipsShown: boolean;
	toggleNearbyShips: () => void;

	pirateSelectorShown: boolean;
	togglePirateSelector: () => void;
};

const BottomBar: React.FC<Props> = ({
	toggleControls,
	toggleNearbyShips,
	togglePirateSelector,
}) => {
	const { language, mute, toggleMute } = useContext(AppConfigContext);

	return (
		<>
			<div
				className="h-20 md:h-24 w-screen absolute bg-black z-20 flex items-center flex-row justify-between  px-4 md:px-32 lg:px-48 xl:px-96"
				style={{
					bottom: 0,
					left: 0,
					color: "white",
				}}
			>
				<button
					onClick={togglePirateSelector}
					className="flex flex-col justify-center items-center w-12 h-12 md:w-16 md:h-16"
				>
					<img
						src="Report.svg"
						alt="Report"
						width={24}
						height={24}
						className="w-4 h-4 md:w-6 md:h-6"
					/>
					<p className="text-center mt-1 md:mt-2 text-xs md:text-sm">
						{strings[language].Info.Report}
					</p>
				</button>

				<button
					onClick={toggleControls}
					className="flex flex-col justify-center items-center w-12 h-12 md:w-16 md:h-16"
				>
					<img
						src="Controls.svg"
						alt="Controls"
						className="w-4 h-4 md:w-6 md:h-6"
					/>
					<p className="text-center mt-1 md:mt-2 text-xs md:text-sm">
						{strings[language].Info.Controls}
					</p>
				</button>

				<button
					onClick={toggleNearbyShips}
					className="flex flex-col justify-center items-center w-12 h-12 md:w-16 md:h-16"
				>
					<img
						src="Nearby.svg"
						alt="Nearby Ships"
						className="w-4 h-4 md:w-6 md:h-6"
					/>
					<p className="text-center mt-1 md:mt-2 text-xs md:text-sm">
						{strings[language].Info.NearbyShips}
					</p>
				</button>

				<button
					onClick={toggleMute}
					className="flex flex-col justify-center items-center w-12 h-12 md:w-16 md:h-16"
				>
					<img
						src={mute ? "Unmute.svg" : "Mute.svg"}
						alt="Sounds Muted"
						className="w-4 h-4 md:w-6 md:h-6"
					/>
					<p className="text-center mt-1 md:mt-2 text-xs md:text-sm">
						{mute
							? strings[language].Info.Unmute
							: strings[language].Info.Mute}
					</p>
				</button>
			</div>
		</>
	);
};

export default BottomBar;
