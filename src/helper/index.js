import { jwtDecode } from 'jwt-decode';
export const checkUserTokenExpiry = () => {
	const token = localStorage.getItem('usertoken');
	if (!token) {
		return false;
	}

	let decoded = jwtDecode(token);
	const { dropBoxTokenCreateAt, dropBoxExpiresIn } = decoded;

	if (Date.now() - dropBoxTokenCreateAt > dropBoxExpiresIn * 1000) {
		return false;
	}
	return true;
};
