import React, { useContext, useEffect, useState } from "react";
import { NearbyShip } from "../../types/types";
import { AppConfigContext } from "../../utils/AppConfigContext";

type Props = {
	nearbyShips: Array<NearbyShip> | null;
};

const NavigationGuide: React.FC<Props> = ({ nearbyShips }) => {
	const { location } = useContext(AppConfigContext);

	const [goTo, setGoTo] = useState(0);
	const [moveBy, setMoveBy] = useState(0);
	const [direction, setDirection] = useState(null);
	const [showGuide, setShowGuide] = useState(false);

	console.log("heading", location?.heading);

	useEffect(() => {
		if (nearbyShips && location) {
			const headingShips = nearbyShips
				.filter((ship) => ship.inFOV)
				.map((ship) => ship.angle);
			// .sort((a, b) => a - b)
			if (headingShips?.length > 0) {
				setShowGuide(true);
				let minusDiff =
					headingShips[0] -
					parseInt(process.env.REACT_APP_NEARBY_ANGLE || "35");

				if (minusDiff < 0) {
					minusDiff = 360 + minusDiff;
				}
				const plusDiff =
					headingShips[0] +
					parseInt(process.env.REACT_APP_NEARBY_ANGLE || "35");

				const closest = [minusDiff, plusDiff].reduce(function (
					prev,
					curr
				) {
					return Math.abs(curr - location.heading) <
						Math.abs(prev - location.heading)
						? curr
						: prev;
				});

				console.log({
					ship: headingShips[0],
					minusDiff,
					plusDiff,
					closest,
				});

				setGoTo(closest);
				if (location.heading > closest) {
					setMoveBy(location.heading - closest);
				} else {
					setMoveBy(closest - location.heading);
				}

				// if (
				// 	plusDiff - location?.heading <
				// 	location.heading - minusDiff
				// ) {
				// 	setGoTo(plusDiff);
				// 	setMoveBy(
				// 		plusDiff -
				// 			(location.heading === 360 ? 0 : location.heading)
				// 	);
				// 	console.log({
				// 		goto: plusDiff,
				// 		move: plusDiff - location.heading,
				// 	});
				// 	console.log("plus");
				// } else {
				// 	setGoTo(minusDiff);
				// 	setMoveBy(location.heading - minusDiff);
				// 	console.log("minus");
				// 	console.log({
				// 		goto: minusDiff,
				// 		move: location.heading - minusDiff,
				// 	});
				// }
			} else {
				setShowGuide(false);
			}
		}
	}, [nearbyShips, location]);

	if (!showGuide || !location?.heading) {
		return null;
	} else {
		return (
			<div
				className="max-w-full md:mx-0 rounded-full absolute z-10 flex flex-row items-center -mb-4 md:-mb-0"
				style={{
					width: 448,
					height: 112,
					overflow: "hidden",
					minHeight: "80px",
					maxHeight: "100px",
					backgroundColor: "#282828",
					top: 16,
					left: 0,
					marginLeft: "50%",
					transform: "translateX(-50%)",
					color: "white",
					padding: "16px 32px",
				}}
			>
				{(location?.heading === 360 ? 0 : location.heading) > goTo ? (
					<img
						src="/Left.svg"
						alt="Left"
						style={{
							filter: "invert(1)",
						}}
					/>
				) : (
					<img
						src="/Right.svg"
						alt="Right"
						style={{
							filter: "invert(1)",
						}}
					/>
				)}

				<div className="mx-8 flex-grow w-full">
					<p className="text-md md:text-xl font-semibold">
						Navigation Guide
					</p>
					<p className="text-sm md:text-md font-medium">
						Move {moveBy.toFixed(0)}° to{" "}
						{location?.heading > goTo
							? "Anti-Clockwise (Left)"
							: "Clockwise (Right)"}{" "}
						<br />
						towards {goTo.toFixed(0)}°
					</p>
				</div>
				<img
					src="Close.svg"
					alt="Close"
					className="cursor-pointer"
					width={30}
					height={30}
					onClick={() => setShowGuide(false)}
					style={{
						filter: "invert(1)",
					}}
				/>
			</div>
		);
	}
};

export default NavigationGuide;
