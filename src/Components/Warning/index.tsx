import React from "react";

const Warning: React.FC<any> = () => {
	return (
		<div
			style={{
				backgroundColor: "white",
				padding: "16px",
				color: "black",
			}}
		>
			<p>You are entering a region with traffic</p>
		</div>
	);
};

export default Warning;
