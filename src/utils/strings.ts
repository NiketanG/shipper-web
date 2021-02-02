export const strings = {
	ENG: {
		Warning: {
			HeadingTowards: `You are heading towards another ship within ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms.`,
			ShipNearby: `There is another ship nearby within ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms. `,
			TrafficRegion: "You are entering a region with traffic",
			MultipleNearby: `There are multiple ships nearby within ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			}kms.`,
			PirateWarn: "Unidentified ship nearby, proceed with caution",
		},
		Info: {
			ReportPirate: "Report Suspicious Ship",
			Report: "Report",
			Close: "Close",
			SelectPirate: "Click on the location of suspicious ship",
			Name: "Name",
			Email: "Email",
			Speed: "Speed",
		},
	},
	HIN: {
		Warning: {
			HeadingTowards: `आप ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} किमी के भीतर एक और जहाज की ओर जा रहे हैं`,
			ShipNearby: `${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} किमी के भीतर एक और जहाज है`,
			TrafficRegion: "आप ट्रैफ़िक वाले क्षेत्र में प्रवेश कर रहे हैं",
			MultipleNearby: `${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} किमी के भीतर पास में कई जहाज हैं`,
			PirateWarn: "पास में अज्ञात जहाज, सावधानी के साथ आगे बढ़ें",
		},
		Info: {
			ReportPirate: "संदेहास्पद जहाज",
			SelectPirate: "संदिग्ध जहाज के स्थान पर क्लिक करें",
			Report: "संदेश",
			Close: "बंद करे",
			Name: "नाम",
			Email: "ईमेल",
			Speed: "गति",
		},
	},
	FIL: {
		Warning: {
			HeadingTowards: `Papunta ka sa ibang barko sa loob ng ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms.`,
			ShipNearby: `May isa pang barko malapit sa loob ng ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms. `,
			TrafficRegion: "Pumapasok ka sa isang rehiyon na may trapiko",
			MultipleNearby: `Mayroong maraming mga barko sa malapit sa loob ng ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			}kms.`,
			PirateWarn:
				"Hindi kilalang barko sa malapit, magpatuloy sa pag-iingat",
		},
		Info: {
			ReportPirate: "Iulat ang Kahina-hinalang Barko",
			SelectPirate: "Mag-click sa lokasyon ng kahina-hinalang barko",
			Close: "Isara",
			Report: "Iulat",
			Name: "Pangalan",
			Email: "Email",
			Speed: "Pangalan",
		},
	},
	MALAY: {
		Warning: {
			HeadingTowards: `Anda menuju ke kapal lain dalam jarak ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms.`,
			ShipNearby: `Terdapat kapal lain yang berdekatan dalam jarak ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} kms. `,
			TrafficRegion: "Anda memasuki kawasan dengan lalu lintas",
			MultipleNearby: `Terdapat beberapa kapal berdekatan dalam jarak ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			}kms.`,
			PirateWarn:
				"Kapal yang tidak dikenali berdekatan, terus berhati-hati",
		},
		Info: {
			ReportPirate: "Laporkan Kapal Mencurigakan",
			SelectPirate: "Klik pada lokasi kapal yang mencurigakan",
			Report: "Lapor",
			Close: "Tutup",
			Name: "Nama",
			Email: "E-mel",
			Speed: "Kepantasan",
		},
	},
};
