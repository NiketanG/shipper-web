import React from "react";

type SpinnerProps = {
	color?: string;
	size?: number;
};
const Spinner: React.FC<SpinnerProps> = ({ color = "#fc2f70" }) => {
	return (
		<>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
					fill={color}
				/>
			</svg>
			<style>{`
				svg {
					width: 3.75em;
					transform-origin: center;
					animation: rotate 1s cubic-bezier(.6,0,.4,1) infinite;
				}

				@keyframes rotate {
					100% {
						transform: rotate(360deg);
					}
				}

			`}</style>
		</>
	);
};

export default Spinner;
