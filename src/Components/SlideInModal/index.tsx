import React from "react";
import { useSpring, animated } from "react-spring";
import useMedia from "use-media";

type Props = {
	open: boolean;
	children: React.ReactNode;
};
const SlideInModal: React.FC<Props> = ({ children, open }) => {
	const isMobile = useMedia({ maxWidth: "640px" });
	const { innerWidth } = window;

	const { width, opacity } = useSpring({
		width: open ? (isMobile ? innerWidth : 448) : 0,
		opacity: open ? 1 : 0,
	});

	return (
		<animated.div
			className={`overflow-hidden bg-white z-50 absolute rounded-lg shadow-2xl py-12 ${
				open ? "px-8" : "px-0"
			}`}
			style={{
				width,
				height: "calc(100% - 96px)",
			}}
		>
			<animated.div
				style={{
					opacity,
					width: isMobile ? innerWidth - 64 : 384,
				}}
			>
				{children}
			</animated.div>
		</animated.div>
	);
};

export default SlideInModal;
