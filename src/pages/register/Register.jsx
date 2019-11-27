import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import { AuthenticationContext } from "../../context/Authentication";
import { usePostReq } from "../../hooks/usePostReq";

import { RegisterForm } from "./components/registerForm";
import { ValidationList } from "../../components/validationList";

export const Register = props => {
	const { authenticated } = useContext(AuthenticationContext);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const { data, loading, setBody } = usePostReq("users/register");

	const submit = e => {
		e.preventDefault();
		setBody({
			username,
			password
		});
	};

	if (data && data.status === 200) return <Redirect to="/login" />;
	if (authenticated) return <Redirect to="/" />;

	return (
		<>
			{loading ? <p>Loading...</p> : null}
			<ValidationList errors={data.error} />
			<RegisterForm
				email={email}
				setEmail={setEmail}
				username={username}
				setUsername={setUsername}
				password={password}
				setPassword={setPassword}
				confirm={confirm}
				setConfirm={setConfirm}
				submit={submit}
			/>
		</>
	);
};
