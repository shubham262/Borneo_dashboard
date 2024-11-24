import { DashboardState } from './dashboard/state';

const CombineState = () => {
	return {
		dashboardInfo: DashboardState(),
	};
};

export default CombineState;
