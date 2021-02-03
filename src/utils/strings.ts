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

			HeadingTowardsTitle: "Collision Warning",
			ShipNearbyTitle: "Ship Nearby",
			TrafficRegionTitle: "Entering Traffic Region",
			MultipleNearbyTitle: "Multiple Ships nearby",
			PirateWarnTitle: "Unidentified Ship Nearby",

			MultipleNearby: `There are multiple ships nearby within ${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			}kms.`,
			PirateWarn: "Proceed with caution",
		},
		Info: {
			ReportPirate: "Report Suspicious Ship",
			NearbyShips: "Nearby Ships",
			Controls: "Controls",
			Language: "Language",
			Mute: "Mute",
			Unmute: "Unmute",
			Report: "Report",
			Close: "Close",
			SelectPirate: "Click on the location of suspicious ship",
			Name: "Name",
			Email: "Email",
			Speed: "Speed",
			Distance: "Distance",
			SelectedShip: "Selected Ship",
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
			ShipNearbyTitle: "निकटवर्ती जहाज",
			HeadingTowardsTitle: "टक्कर की चेतावनी",
			TrafficRegionTitle: "यातायात क्षेत्र",
			MultipleNearbyTitle: "एकाधिक जहाजों के पास",
			PirateWarnTitle: "अज्ञात जहाज निकटवर्ती",

			MultipleNearby: `${
				process.env.REACT_APP_NEARBY_RADIUS || 5
			} किमी के भीतर पास में कई जहाज हैं`,

			PirateWarn: "सावधानी के साथ आगे बढ़ें",
		},
		Info: {
			ReportPirate: "संदेहास्पद जहाज",
			SelectPirate: "संदिग्ध जहाज के स्थान पर क्लिक करें",
			NearbyShips: "पास के जहाज",
			Controls: "नियंत्रण",
			Language: "भाषा",
			Mute: "मूक",
			Unmute: "अनम्यूट",
			Report: "संदेश",
			Close: "बंद करे",
			Name: "नाम",
			Email: "ईमेल",
			Speed: "गति",
			Distance: "दूरी",
			SelectedShip: "चयनित जहाज",
		},
	},
	FIL: {
		Warning: {
			HeadingTowardsTitle: "Babala sa Pagbabangga",
			ShipNearbyTitle: "Kalapit na Barko",
			TrafficRegionTitle: "Pagpasok sa Rehiyon ng Trapiko",
			MultipleNearbyTitle: "Maramihang mga Barko sa malapit",
			PirateWarnTitle: "Hindi Kilalang Kalapit na Barko",

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
			PirateWarn: "Magpatuloy nang may pag-iingat",
		},
		Info: {
			NearbyShips: "Mga Kalapit na Barko",
			Controls: "Mga Kontrol",
			Language: "Wika",
			Mute: "I-mute",
			Unmute: "I-unmute",
			ReportPirate: "Iulat ang Kahina-hinalang Barko",
			SelectPirate: "Mag-click sa lokasyon ng kahina-hinalang barko",
			Close: "Isara",
			Report: "Iulat",
			Name: "Pangalan",
			Email: "Email",
			Speed: "Pangalan",
			Distance: "Distansya",
			SelectedShip: "Napiling Barko",
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
			PirateWarn: "Teruskan dengan berhati-hati",

			HeadingTowardsTitle: "Amaran Perlanggaran",
			ShipNearbyTitle: "Penghantaran Berdekatan",
			TrafficRegionTitle: "Memasuki Kawasan Lalu Lintas",
			MultipleNearbyTitle: "Pelbagai Kapal berdekatan",
			PirateWarnTitle: "Kapal Tidak Dikenal Berdekatan",
		},
		Info: {
			NearbyShips: "Kapal Berdekatan",
			Controls: "Kawalan",
			Language: "Bahasa",
			Mute: "Bisu",
			Unmute: "Tidak bersuara",
			ReportPirate: "Laporkan Kapal Mencurigakan",
			SelectPirate: "Klik pada lokasi kapal yang mencurigakan",
			Report: "Lapor",
			Close: "Tutup",
			Name: "Nama",
			Email: "E-mel",
			Speed: "Kepantasan",
			Distance: "Jarak",
			SelectedShip: "Kapal Terpilih",
		},
	},
};
