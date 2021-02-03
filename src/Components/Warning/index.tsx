import React, { useContext } from "react";
import { WarningTypes } from "../../types/types";
import { AppConfigContext } from "../../utils/AppConfigContext";
import { useSpring, animated } from "react-spring";

type Props = {
	severity: "LOW" | "MEDIUM" | "HIGH";
	text: string;
	title: string;
	type: WarningTypes;
};

const Warning: React.FC<Props> = ({
	severity = "MEDIUM",
	text,
	title,
	type,
}) => {
	const { muteType, setMuteType } = useContext(AppConfigContext);
	const { width, height } = useSpring({
		width: muteType === type ? 0 : 512,
		height: muteType === type ? 0 : "auto",
	});
	if (muteType === type) return null;

	return (
		<animated.div
			className="max-w-full md:mx-0 rounded-full absolute z-10 flex flex-row items-center -mb-4 md:-mb-0"
			style={{
				width,
				height,
				overflow: "hidden",
				minHeight: "80px",
				maxHeight: "100px",
				backgroundColor:
					severity === "HIGH"
						? "#F42C2C"
						: severity === "MEDIUM"
						? "#EF6C00"
						: "#282828",
				bottom: 112,
				left: 0,
				marginLeft: "50%",
				transform: "translateX(-50%)",
				color: "white",
				padding: "16px 32px",
			}}
		>
			<img
				src="Warning.svg"
				alt="Warning"
				width={30}
				height={30}
				style={{
					filter: "invert(1)",
				}}
			/>
			<div className="mx-8 flex-grow w-full">
				<p className="text-md md:text-xl font-semibold">{title}</p>
				<p className="text-sm md:text-md font-medium">{text}</p>
			</div>
			<img
				src="Close.svg"
				alt="Close"
				className="cursor-pointer"
				width={30}
				height={30}
				onClick={() => {
					setMuteType(type);
				}}
				style={{
					filter: "invert(1)",
				}}
			/>
		</animated.div>
	);
};

export default Warning;
