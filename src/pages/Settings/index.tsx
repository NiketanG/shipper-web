import React, { useContext, useState } from "react";
import {
	AppConfigContext,
	Languages,
	LanguagesList,
} from "../../utils/AppConfigContext";
import { useHistory } from "react-router-dom";
import useMedia from "use-media";
import { useSpring, animated } from "react-spring";
import { strings } from "../../utils/strings";
const Settings: React.FC<any> = () => {
	const {
		theme,
		language,
		setLanguage,
		setTheme,
		radius,
		setRadius,
	} = useContext(AppConfigContext);
	const [showLanguages, setShowLanguages] = useState(false);

	const toggleLanguages = () => setShowLanguages(!showLanguages);
	const hideLanguages = () => setShowLanguages(false);

	const hideLists = () => {
		if (showLanguages) hideLanguages();
		if (showTheme) hideTheme();
	};
	const isMobile = useMedia({ maxWidth: "640px" });

	const history = useHistory();
	const {
		width: widthLanguage,
		height: heightLanguage,
		marginLeft: marginLeftLanguage,
	} = useSpring({
		width: showLanguages ? 168 : 0,
		height: showLanguages ? (isMobile ? 192 : 208) : 0,
		marginLeft: showLanguages ? -128 : 0,
	});

	const [showTheme, setShowTheme] = useState(false);

	const {
		width: widthTheme,
		height: heightTheme,
		marginLeft: marginLeftTheme,
	} = useSpring({
		width: showTheme ? 168 : 0,
		height: showTheme ? (isMobile ? 96 : 104) : 0,
		marginLeft: showTheme ? -128 : 0,
	});

	const toggleThemeMenu = () => setShowTheme(!showTheme);
	const hideTheme = () => setShowTheme(false);

	return (
		<div className="dark:bg-bgDark w-screen dark:text-white">
			<div
				onClick={hideLists}
				className="container px-8 mx-auto flex py-12 lg:px-48 flex-col "
				style={{
					height: window.innerHeight,
				}}
			>
				<h1 className="font-semibold text-xl md:text-2xl">
					{strings[language].Info.Settings}
				</h1>

				<div className="h-full flex flex-col  mt-6 mb-4 md:space-y-2">
					<div
						onClick={toggleThemeMenu}
						className="flex flex-row justify-between transition bg-transparent px-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded py-3 md:py-4"
					>
						<p className="text-base md:text-lg">Theme</p>
						<div>
							<button>{theme.toUpperCase()}</button>
							<animated.div
								className="-ml-32 -mt-8 shadow-lg bg-white dark:bg-bgDark absolute z-40 flex flex-col rounded items-start overflow-hidden"
								style={{
									width: widthTheme,
									height: heightTheme,
									marginLeft: marginLeftTheme,
								}}
							>
								{["light", "dark"].map((item, index) => (
									<button
										className={`text-base md:text-lg hover:bg-gray-300 dark:hover:bg-gray-900 w-full text-left px-4 py-3 transition ease-in ${
											theme === item
												? "font-bold"
												: "font-normal"
										}`}
										value={item}
										key={index}
										onClick={() => {
											setTheme(
												item === "light"
													? "light"
													: "dark"
											);
											hideTheme();
										}}
									>
										{item.toUpperCase()}
									</button>
								))}
							</animated.div>
						</div>
					</div>
					<div
						onClick={toggleLanguages}
						className="flex flex-row justify-between transition bg-transparent px-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded py-3 md:py-4"
					>
						<p className="text-base md:text-lg">
							{strings[language].Info.Language}
						</p>
						<div>
							<p>{language.toUpperCase()}</p>
							{showLanguages && (
								<animated.div
									className="-ml-32 -mt-8 shadow-lg bg-white dark:bg-bgDark absolute z-40 flex flex-col rounded items-start overflow-hidden"
									style={{
										width: widthLanguage,
										height: heightLanguage,
										marginLeft: marginLeftLanguage,
									}}
								>
									{LanguagesList.map((lang) => (
										<button
											className={`text-base md:text-lg hover:bg-gray-300 dark:hover:bg-gray-900 w-full text-left px-4 py-3 transition ease-in ${
												language === lang.value
													? "font-bold"
													: "font-normal"
											}`}
											value={lang.value}
											key={lang.value}
											onClick={() => {
												setLanguage(
													lang.value as Languages
												);
												setShowLanguages(false);
											}}
										>
											{lang.label}
										</button>
									))}
								</animated.div>
							)}
						</div>
					</div>
					<div className="flex flex-row justify-between transition bg-transparent px-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded py-3 md:py-4">
						<p className="text-base md:text-lg">
							{strings[language].Info.Radius}
						</p>
						<input
							type="text"
							value={radius}
							onChange={(e) =>
								setRadius(parseInt(e.target.value))
							}
							className="w-16 px-3 py-2 rounded focus:outline-none bg-white dark:bg-gray-800"
						/>
					</div>
				</div>
				<button
					onClick={() => {
						history.replace("/map");
					}}
					className="w-full md:w-40 md:self-end text-white font-medium bg-indigo-500 rounded py-3 "
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default Settings;
