/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from "react";

type Location = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
};

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
type LocationContextType = {
	location: Location | null;
	email: string | null;
	language: Languages;
	setEmail: (newEmail: string) => void;
	setLocation: (location: Location) => void;
	setLanguage: (newLanguage: Languages) => void;
};

export const CurrentLocationContext = createContext<LocationContextType>({
	email: null,
	location: null,
	language: "ENG",
	setLanguage: () => {},
	setEmail: () => {},
	setLocation: () => {},
});

type Props = {
	children: React.ReactNode;
};

const LocationContextProvider: React.FC<Props> = ({ children }) => {
	const [location, setLocation] = useState<Location | null>({
		heading: 0,
		speed: 0,
		latitude: 17.00919245936354,
		longitude: 73.26783158874858,
	});

	const [email, setEmail] = useState<string | null>(null);

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

	return (
		<CurrentLocationContext.Provider
			value={{
				email,
				language,
				location,
				setLanguage: updateLanguage,
				setEmail: updateEmail,
				setLocation: updateLocation,
			}}
		>
			{children}
		</CurrentLocationContext.Provider>
	);
};

export default LocationContextProvider;
