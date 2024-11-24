import { intialState } from './state';
const actionHandlers = {
	FETCH_AUTHENTICATED_USERS_DOCUMENT_SUCCESS: (state, action) => ({
		...state,
		files: action.payload,
	}),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;