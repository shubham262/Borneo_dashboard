import React, { memo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Oauth = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const token = params.get('token');
	useEffect(() => {
		if (!token) {
			return navigate('/');
		}
		localStorage.setItem('usertoken', token);
		navigate('/home');
	}, []);
};

export default memo(Oauth);
