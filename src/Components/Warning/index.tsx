import React from "react";

const Warning: React.FC<any> = () => {
	return (
		<div
			style={{
				width: "50%",
				backgroundColor: "#F42C2C",
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
			You are entering a region with traffic
		</div>
	);
};

export default Warning;
