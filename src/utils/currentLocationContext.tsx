/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

type Location = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
};

type LocationContextType = {
	location: Location | null;
	email: string | null;
	setEmail: (newEmail: string) => void;
	setLocation: (location: Location) => void;
};

export const CurrentLocationContext = createContext<LocationContextType>({
	email: null,
	location: null,
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

	const updateLocation = (newLocation: Location) => {
		setLocation({
			...newLocation,
		});
	};

	const updateEmail = (newEmail: string) => setEmail(newEmail);

	return (
		<CurrentLocationContext.Provider
			value={{
				email,
				location,
				setEmail: updateEmail,
				setLocation: updateLocation,
			}}
		>
			{children}
		</CurrentLocationContext.Provider>
	);
};

export default LocationContextProvider;
