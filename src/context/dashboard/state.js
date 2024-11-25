import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import api from '../../service';
import { type } from '@testing-library/user-event/dist/type';

export const intialState = {
	files: null,
	searchResults: null,
};

export const DashboardState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const authenticateUsingDropBox = async () => {
		try {
			const response = await api.get('/dropbox');
			const { url } = response.data;
			return url;
		} catch (error) {
			console.log('error==>authenticateUsingDropBox', error);
		}
	};

	const fetchAllDocuments = async () => {
		try {
			const response = await api.get('/dropbox-documents');
			const { entries, has_more } = response.data;
			dispatch({
				type: Actions.FETCH_AUTHENTICATED_USERS_DOCUMENT_SUCCESS,
				payload: { files: entries, hasMore: has_more },
			});
		} catch (error) {
			console.log('error==>fetchAllDocuments', error);
		}
	};

	const searchContent = async (query) => {
		try {
			const response = await api.get(
				`/dropbox-seacrch-documents?query=${query}`
			);
			const { data } = response?.data;

			dispatch({
				type: Actions.FETCH_SEARCH_RESULTS_SUCCESS,
				payload: data,
			});
		} catch (error) {
			console.log('error==>searchContent', error);
		}
	};

	return {
		...state,
		authenticateUsingDropBox,
		fetchAllDocuments,
		searchContent,
	};
};
