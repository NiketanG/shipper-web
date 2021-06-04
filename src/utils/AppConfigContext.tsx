/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from "react";
import { WarningTypes, Location } from "../types/types";

export type Languages = "ENG" | "HIN" | "MALAY" | "FIL";
export const LanguagesList = [
	{
		label: "English",
		value: "ENG",
	},
	{
		label: "Hindi",
		value: "HIN",
	},
	{
		label: "Malay",
		value: "MALAY",
	},
	{
		label: "Filipino",
		value: "FIL",
	},
];

export type Theme = "light" | "dark";

type AppConfigContextType = {
	location: Location | null;
	email: string | null;
	language: Languages;
	mute: boolean;
	muteType: WarningTypes;
	speed: number;
	showGuide: boolean;
	theme: Theme;
	radius: number;
	setRadius: (newRadius: number) => void;
	setTheme: (newTheme: Theme) => void;
	toggleGuide: () => void;
	setSpeed: (newSpeed: number) => void;
	setMuteType: (newType: WarningTypes) => void;
	toggleMute: () => void;
	setEmail: (newEmail: string) => void;
	setLocation: (location: Location) => void;
	setLanguage: (newLanguage: Languages) => void;
};

export const AppConfigContext = createContext<AppConfigContextType>({
	email: null,
	location: null,
	language: "ENG",
	mute: false,
	muteType: WarningTypes.None,
	speed: 0.0005,
	showGuide: true,
	theme: "light",
	radius: parseInt(process.env.REACT_APP_NEARBY_RADIUS || "5"),
	setRadius: () => {},
	setTheme: () => {},
	toggleGuide: () => {},
	setSpeed: () => {},
	setMuteType: () => {},
	toggleMute: () => {},
	setLanguage: () => {},
	setEmail: () => {},
	setLocation: () => {},
});

type Props = {
	children: React.ReactNode;
};

const AppContextProvider: React.FC<Props> = ({ children }) => {
	const [location, setLocation] = useState<Location | null>({
		heading: 0,
		speed: 0,
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
	});

	const [email, setEmail] = useState<string | null>(null);
	const [radius, setRadius] = useState(
		parseInt(process.env.REACT_APP_NEARBY_RADIUS || "5")
	);

	const updateRadius = (newRadius: number) => {
		setRadius(newRadius);
		localStorage.setItem("radius", newRadius.toString());
	};

	useEffect(() => {
		const lang = localStorage.getItem("language");
		if (lang) {
			setLanguage(lang as Languages);
		}
	}, []);

	const [language, setLanguage] = useState<Languages>("ENG");

	const updateLanguage = (newLang: Languages) => {
		localStorage.setItem("language", newLang);
		setLanguage(newLang);
	};

	const updateLocation = (newLocation: Location) => {
		setLocation({
			...newLocation,
		});
	};

	const updateEmail = (newEmail: string) => {
		setEmail(newEmail);
	};

	const [mute, setMute] = useState(false);
	const toggleMute = () => {
		localStorage.setItem("mute", mute ? "false" : "true");
		setMute(!mute);
	};

	useEffect(() => {
		const muted = localStorage.getItem("mute");
		if (muted) {
			setMute(muted === "true");
		}
	}, []);

	const [muteType, setMuteType] = useState<WarningTypes>(WarningTypes.None);

	const updateMuteType = (newType: WarningTypes) => {
		setMuteType(newType);
		localStorage.setItem("muteType", newType.toString());
	};

	const [theme, setTheme] = useState<Theme>("light");

	const updateTheme = (newTheme: Theme) => {
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	useEffect(() => {
		const muteTypeStored = localStorage.getItem("muteType");
		if (muteTypeStored) {
			switch (muteTypeStored) {
				case "MultipleShips":
					setMuteType(WarningTypes.MultipleShips);
					break;

				case "TrafficRegion":
					setMuteType(WarningTypes.TrafficRegion);
					break;

				case "CollisionWarning":
					setMuteType(WarningTypes.CollisionWarning);
					break;

				case "UnidentifiedShip":
					setMuteType(WarningTypes.UnidentifiedShip);
					break;

				case "NearbyShip":
					setMuteType(WarningTypes.NearbyShip);
					break;

				default:
					setMuteType(WarningTypes.None);
					break;
			}
		}
	}, []);

	useEffect(() => {
		const themeStored = localStorage.getItem("theme");
		if (themeStored) {
			setTheme(themeStored === "light" ? "light" : "dark");

			if (themeStored === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, []);

	useEffect(() => {
		const radiusStored = localStorage.getItem("radius");
		if (radiusStored) {
			setRadius(parseInt(radiusStored));
		} else {
			const defaultRadius = parseInt(
				process.env.REACT_APP_NEARBY_RADIUS || "5"
			);
			setRadius(defaultRadius);
			localStorage.setItem("radius", defaultRadius.toString());
		}
	}, []);

	const [speed, setSpeed] = useState(0.001);
	const updateSpeed = (newSpeed: number) => setSpeed(newSpeed);

	const [showGuide, setShowGuide] = useState(true);
	const toggleGuide = () => setShowGuide(!showGuide);

	return (
		<AppConfigContext.Provider
			value={{
				theme,
				email,
				language,
				location,
				mute,
				muteType,
				speed,
				showGuide,
				radius,
				setRadius: updateRadius,
				setTheme: updateTheme,
				toggleMute,
				toggleGuide,
				setSpeed: updateSpeed,
				setMuteType: updateMuteType,
				setLanguage: updateLanguage,
				setEmail: updateEmail,
				setLocation: updateLocation,
			}}
		>
			{children}
		</AppConfigContext.Provider>
	);
};

export default AppContextProvider;
