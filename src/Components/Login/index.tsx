import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CurrentLocationContext } from "../../utils/currentLocationContext";

const Login: React.FC<any> = () => {
	const windowLocation = useHistory();
	const [loading, setLoading] = useState(true);

	const { setEmail, setLocation } = useContext(CurrentLocationContext);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/users/current`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log(res);
				if (res.status === 200 && res.data && res.data.email) {
					setEmail(res.data.email);
					setLocation({
						heading: res.data.heading,
						latitude: res.data.latitude,
						longitude: res.data.longitude,
						speed: res.data.speed,
					});
					windowLocation.replace("/map");
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					display: "flex",
					height: "100%",
					flexDirection: "column",
				}}
			>
				<p>Loading</p>
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<h3>Login</h3>
			<a href={`${process.env.REACT_APP_API_URL}/login/google`}>
				Continue with Google
			</a>
		</div>
	);
};

export default Login;
