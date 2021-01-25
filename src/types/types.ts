export type OtherShips = {
	latitude: number;
	longitude: number;
	heading: number;
	speed: number;
	email: string;
	name: string;
};

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
