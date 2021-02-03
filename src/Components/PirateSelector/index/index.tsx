import React, { useContext } from "react";
import { AppConfigContext } from "../../../utils/AppConfigContext";
import socket from "../../../utils/socket";
import { strings } from "../../../utils/strings";

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
		<div>
			<p
				className="shadow w-full md:w-1/2  md:px-0 bg-white absolute z-10 text-center"
				style={{
					transform: "translateX(-50%)",
					color: "black",

					top: 16,
					left: "50%",
					borderRadius: 4,
					padding: "8px 16px",
					marginBottom: 16,
					fontSize: "20px",
				}}
			>
				{strings[language].Info.SelectPirate}
			</p>

			<img
				src="/Close.svg"
				alt="Close"
				onClick={closePirateSelector}
				width={32}
				height={32}
				style={{
					cursor: "pointer",
					borderRadius: "4px",
					position: "absolute",
					top: "32px",
					right: "16px",
					zIndex: 10,
				}}
			/>

			<div
				onClick={addPirate}
				className="shadow-lg"
				style={{
					cursor: "pointer",
					backgroundColor: "white",
					color: "black",
					padding: "12px 32px",
					borderRadius: "48px",
					position: "absolute",
					marginLeft: "50%",
					transform: "translateX(-50%)",
					bottom: 126,
					zIndex: 10,
					textAlign: "right",
					fontSize: "20px",
					fontWeight: 500,
				}}
			>
				{strings[language].Info.Report}
			</div>
		</div>
	);
};

export default PirateSelector;
