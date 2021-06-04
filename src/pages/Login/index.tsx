import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AppConfigContext } from "../../utils/AppConfigContext";
import Spinner from "../../Components/Loading";

const Login: React.FC<any> = () => {
	const windowLocation = useHistory();
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [apiReachable, setApiReachable] = useState(false);

	const { setEmail: saveEmail, setLocation } = useContext(AppConfigContext);

	const checkApiReachable = async () => {
		try {
			const apiResponse = await axios.get(
				`${process.env.REACT_APP_API_URL}`
			);
			if (apiResponse.status !== 200) {
				console.error("API Response : ", apiResponse);
				alert("API not reachable");
				setApiReachable(false);
			} else {
				setApiReachable(true);
			}
		} catch (err) {
			console.error(err);
			setApiReachable(false);
			alert("API not reachable");
		}
	};

	useEffect(() => {
		checkApiReachable();
	}, []);
	const login = async () => {
		try {
			setLoading(true);
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
						latitude:
							loginResponse.data.latitude || 17.00919245936354,
						longitude:
							loginResponse.data.longitude || 73.26783158874858,
						speed: loginResponse.data.speed || 0,
					});
					localStorage.setItem("name", name);
					localStorage.setItem("email", email);
					setLoading(false);
					setError(null);
					windowLocation.replace("/map");
				} else {
					console.error(loginResponse);
					alert(loginResponse);
					setError("An error occured.");
				}
			} else {
				setLoading(false);
				setError("Invalid email or password");
			}
		} catch (err) {
			setLoading(false);
			alert(err);
			console.error(err);
			setError("An error occured.");
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
			windowLocation.replace("/map");
		}
		setLoading(false);
	}, []);

	return (
		<section
			className="text-gray-600 body-font flex items-center justify-center"
			style={{
				height: window.innerHeight,
			}}
		>
			<div className="container px-5 mx-auto flex flex-wrap items-center lg:px-48">
				<div className="lg:w-2/6 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
					<h1 className="title-font font-medium text-4xl text-gray-900">
						Shipper
					</h1>
					<p className="leading-relaxed mt-4">
						Traffic management for Coastal Regions
					</p>
					<p className="text-sm text-light text-gray-500 mt-1">
						Developed for ASEAN-INDIA Hackathon 2021
					</p>
					<p
						className={`text-sm text-light ${
							apiReachable ? "text-green-500" : "text-red-500"
						} mt-2`}
					>
						{apiReachable ? "API Reachable" : "API Unreachable"}
					</p>
				</div>
				<div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
					<h2 className="text-gray-900 text-lg font-medium title-font mb-5">
						Sign Up
					</h2>
					<div className="relative mb-4">
						<label
							htmlFor="full-name"
							className="leading-7 text-sm text-gray-600"
						>
							Full Name
						</label>
						<input
							type="text"
							id="full-name"
							name="full-name"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							value={name}
							placeholder="Name"
							required
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="email"
							className="leading-7 text-sm text-gray-600"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							value={email}
							placeholder="Email"
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button
						disabled={email.length <= 3 || name.length <= 3}
						className={`flex flex-row items-center justify-center rounded w-full py-3 font-medium ${
							email.length <= 3 || name.length <= 3
								? "bg-gray-300 text-gray-600 cursor-not-allowed"
								: "bg-indigo-500 hover:bg-indigo-600 text-white"
						}`}
						type="submit"
						onClick={login}
					>
						{loading && <Spinner size={24} color={"white"} />}
						<span>Continue</span>
					</button>
					{error && (
						<p className="text-red-500 text-sm md:text-base mt-3">
							{error}
						</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Login;
