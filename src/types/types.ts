export type OtherShips = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
	email: string;
	name: string;
};

export interface NearbyShip extends OtherShips {
	inFOV: boolean;
	distance: number;
	angle: number;
	angleDiff: number;
}

export type SocketShipData = {
	email: string;
	name: string;
	location: Location;
	lastUpdated: string;
};

export type Location = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
};

export type PirateSignals = {
	latitude: number;
	longitude: number;
};

export enum WarningTypes {
	MultipleShips,
	NearbyShip,
	CollisionWarning,
	UnidentifiedShip,
	None,
	TrafficRegion,
}
