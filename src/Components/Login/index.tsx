import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CurrentLocationContext } from "../../utils/currentLocationContext";

const Login: React.FC<any> = () => {
	const windowLocation = useHistory();
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");

	const { setEmail: saveEmail, setLocation } = useContext(
		CurrentLocationContext
	);

	const login = async () => {
		if (email.length > 0 && name.length > 0) {
			const loginResponse = await axios.post(
				`${process.env.REACT_APP_API_URL}/api/users/new`,
				{
					email,
					name,
				}
			);
			if (loginResponse && loginResponse.status === 200) {
				saveEmail(email);
				setLocation({
					heading: loginResponse.data.heading || 0,
					latitude: loginResponse.data.latitude || 17.00919245936354,
					longitude:
						loginResponse.data.longitude || 73.26783158874858,
					speed: loginResponse.data.speed || 0,
				});
				localStorage.setItem("name", name);
				localStorage.setItem("email", email);
				windowLocation.replace("/map");
			} else {
				console.log(loginResponse);
				alert("An error occured");
			}
		} else {
			alert("Check email and name");
		}
	};

	useEffect(() => {
		const savedEmail = localStorage.getItem("email");
		const savedName = localStorage.getItem("name");

		if (
			typeof savedEmail === "string" &&
			typeof savedName === "string" &&
			savedEmail?.length > 0 &&
			savedName?.length > 0
		) {
			setLoading(false);
			windowLocation.replace("/map");
		} else {
			setLoading(false);
		}
	}, []);

	// useEffect(() => {
	// 	axios
	// 		.get(`${process.env.REACT_APP_API_URL}/api/users/current`, {
	// 			withCredentials: true,
	// 		})
	// 		.then((res) => {
	// 			console.log(res);
	// 			if (res.status === 200 && res.data && res.data.email) {
	// 				setEmail(res.data.email);
	// 				setLocation({
	// 					heading: res.data.heading,
	// 					latitude: res.data.latitude,
	// 					longitude: res.data.longitude,
	// 					speed: res.data.speed,
	// 				});
	// 				windowLocation.replace("/map");
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		})
	// 		.finally(() => {
	// 			setLoading(false);
	// 		});
	// }, []);

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
			{/* <a href={`${process.env.REACT_APP_API_URL}/login/google`}>
				Continue with Google
			</a> */}
			<form
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
				onSubmit={(e) => {
					e.preventDefault();
					login();
				}}
			>
				<input
					type="email"
					name="email"
					autoFocus
					id="email"
					style={{
						padding: "4px 12px",
						margin: "12px",
					}}
					value={email}
					placeholder="Email"
					required
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="text"
					name="name"
					id="name"
					style={{
						padding: "4px 12px",
						margin: "8px",
					}}
					value={name}
					placeholder="Name"
					required
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					style={{
						padding: "4px 12px",
						margin: "12px",
					}}
					type="submit"
				>
					Continue
				</button>
			</form>
		</div>
	);
};

export default Login;
