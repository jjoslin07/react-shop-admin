import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/apiCalls";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	flex-direction: column;
	background: linear-gradient(grey, white);
`;
const Input = styled.input`
	height: 30px;
	margin: 8px;
	border-radius: 10px;
	padding: 5px;
	&:focus {
		outline: none;
	}
`;
const Button = styled.button`
	height: 30px;
	width: 60px;
	font-weight: 600;
	font-size: 18px;
	background-image: linear-gradient(
		to right,
		#757f9a 0%,
		#d7dde8 51%,
		#757f9a 100%
	);

	margin: 10px;
	padding: 15px 45px;
	text-align: center;
	text-transform: uppercase;
	transition: 0.5s;
	background-size: 200% auto;
	color: white;
	box-shadow: 0 0 20px #eee;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background-position: right center; /* change the direction of the change here */
		color: #fff;
		text-decoration: none;
	}
`;
const Span = styled.span`
	font-size: 20px;
	font-weight: 400;
	margin-bottom: 5px;
`;
const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();

	const handleClick = (e) => {
		e.preventDefault();
		login(dispatch, { username, password });
	};
	return (
		<>
			<Container>
				<Span>Dashboard</Span>
				<Input
					type="text"
					placeholder="username"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<Input
					type="password"
					placeholder="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button onClick={handleClick}>Login</Button>
			</Container>
		</>
	);
};

export default Login;
