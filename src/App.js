import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './views/Login';
import Home from './views/Home';
import Oauth from './views/Oauth';

function App() {
	return (
		<div className="App">
			{/* routes */}
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/drop-box-oauth" element={<Oauth />} />
				<Route path="/home" element={<Home />} />
			</Routes>
		</div>
	);
}

export default App;
