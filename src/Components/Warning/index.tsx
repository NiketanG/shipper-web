import React from "react";

type Props = {
	severity: "LOW" | "MEDIUM" | "HIGH";
	text: string;
};

const Warning: React.FC<Props> = ({ severity = "MEDIUM", text }) => {
	return (
		<div
			style={{
				width: "50%",
				backgroundColor:
					severity === "HIGH"
						? "#F42C2C"
						: severity === "MEDIUM"
						? "#EF6C00"
						: "#FFA000",
				position: "absolute",
				bottom: 0,
				left: 0,
				borderRadius: 4,
				transform: "translateX(50%)",
				padding: "8px 16px",
				color: "white",
				zIndex: 10,
				marginBottom: 16,
			}}
		>
			{text}
		</div>
	);
};

export default Warning;
