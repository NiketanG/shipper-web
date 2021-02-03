import React, { useContext, useState } from "react";
import { useSpring, animated } from "react-spring";
import {
	AppConfigContext,
	Languages,
	LanguagesList,
} from "../../utils/AppConfigContext";
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
	controlsShown,
	nearbyShipsShown,
	pirateSelectorShown,
	toggleControls,
	toggleNearbyShips,
	togglePirateSelector,
}) => {
	const { language, setLanguage, mute, toggleMute } = useContext(
		AppConfigContext
	);

	const [showLanguages, setShowLanguages] = useState(false);

	const { width, height } = useSpring({
		width: showLanguages ? 160 : 0,
		height: showLanguages ? 224 : 0,
	});
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

				<button
					onClick={() => setShowLanguages(!showLanguages)}
					className="flex flex-col justify-center items-center w-12 h-12 md:w-16 md:h-16"
				>
					<p className="text-md -mb-1 md:text-xl font-semibold">
						{language.toUpperCase()}
					</p>

					<p className="text-center mt-0 md:mt-2 text-xs md:text-sm">
						{strings[language].Info.Language}
					</p>
				</button>
			</div>
			{showLanguages && (
				<animated.div
					className="languageModal shadow-lg bg-white absolute z-40 flex flex-col rounded items-start overflow-hidden"
					style={{
						width,
						height,
						bottom: 112,
						right: 32,
					}}
				>
					{LanguagesList.map((lang) => (
						<button
							className={`text-lg hover:bg-gray-300 w-full text-left px-4 py-3 transition ease-in ${
								language === lang.value
									? "font-bold"
									: "font-normal"
							}`}
							value={lang.value}
							key={lang.value}
							onClick={() => {
								setLanguage(lang.value as Languages);
								setShowLanguages(false);
							}}
						>
							{lang.label}
						</button>
					))}
				</animated.div>
			)}
		</>
	);
};

export default BottomBar;
