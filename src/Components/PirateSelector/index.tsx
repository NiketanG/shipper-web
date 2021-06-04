import React, { useContext } from "react";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { strings } from "../../utils/strings";

type Props = {
	closePirateSelector: () => void;
	addPirate: () => void;
};
const PirateSelector: React.FC<Props> = ({
	addPirate,
	closePirateSelector,
}) => {
	const { language } = useContext(AppConfigContext);
	return (
		<div className="flex flex-col items-center w-screen">
			<p className="flex flex-row bg-white items-center justify-between z-20 shadow w-full md:w-1/2 md:rounded-md md:mt-4 absolute text-center text-black py-4 px-4">
				{strings[language].Info.SelectPirate}
			</p>

			<img
				src="/Close.svg"
				alt="Close"
				onClick={closePirateSelector}
				width={32}
				height={32}
				className="w-6 h-6 md:w-8 md:h-8 z-30 top-3 md:top-8 right-4 rounded absolute cursor-pointer"
			/>

			<button
				onClick={addPirate}
				className="shadow-lg bg-white text-black z-20 font-medium md:text-lg rounded-full bottom-24 md:bottom-32 px-8 py-3 md:px-10"
				style={{
					color: "black",
					position: "absolute",
				}}
			>
				{strings[language].Info.Report}
			</button>
		</div>
	);
};

export default PirateSelector;
