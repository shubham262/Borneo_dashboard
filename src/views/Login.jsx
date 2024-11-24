import React, { memo, useCallback, useContext } from 'react';
import '../assets/scss/login.scss';
import { Button } from 'antd';
import Context from '../context/context';

const Login = (props) => {
	const {
		dashboardInfo: { authenticateUsingDropBox },
	} = useContext(Context);
	const handleDropboxAuth = useCallback(async () => {
		const response = await authenticateUsingDropBox();
		if (response) {
			window.location.href = response;
		}
	}, []);

	return (
		<div className="container">
			<h1 className="title">Welcome to Dropbox Auth</h1>
			<button className="button" onClick={handleDropboxAuth}>
				Authenticate with Dropbox
			</button>
		</div>
	);
};

export default memo(Login);
