import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../context/context';
import '../assets/scss/home.scss';
import { message, Spin } from 'antd';
import { checkUserTokenExpiry } from '../helper';

const Home = () => {
	const navigate = useNavigate();
	const {
		dashboardInfo: {
			fetchAllDocuments,
			files,
			searchContent,
			searchResults,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		search: '',
		loading: true,
		searchLoading: false,
		filesdata: null,
		searchChanged: false,
		timeout: null,
	});

	//useEffects
	useEffect(() => {
		const usertoken = localStorage.getItem('usertoken');
		if (!usertoken) {
			// Redirect to login page if no token is found
			return navigate('/');
		}
		executeFunctionCallWithTokenCheck(fetchAllDocuments);
	}, []);

	useEffect(() => {
		if (files) {
			setInfo((prevInfo) => ({
				...prevInfo,
				filesdata: files.files,
				loading: false,
			}));
		}
	}, [files]);

	useEffect(() => {
		if (searchResults) {
			const filesdata = [];
			for (let i = 0; i < searchResults.length; i++) {
				filesdata?.push(JSON.parse(searchResults?.[i]?.fileData));
			}
			setInfo((prevInfo) => ({
				...prevInfo,
				filesdata,
				loading: false,
			}));
		}
	}, [searchResults]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebounce(info?.search);
		}
	}, [info?.search, info?.searchChanged, files]);

	//function definations
	const formatSize = useCallback((size) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
		return `${(size / (1024 * 1024)).toFixed(2)} MB`;
	}, []);

	const handleDebounce = useCallback(
		(search) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				// Search for files when debounced

				setInfo((prev) => ({ ...prev, loading: true }));
				if (search?.length) {
					executeFunctionCallWithTokenCheck(searchContent, search);
				} else {
					executeFunctionCallWithTokenCheck(fetchAllDocuments);

					setInfo((prev) => ({
						...prev,
						searchChanged: false,
					}));
				}

				setInfo((prev) => ({ ...prev, timeout: null }));
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout, files]
	);

	const executeFunctionCallWithTokenCheck = useCallback((func, args) => {
		const checkAuth = checkUserTokenExpiry();
		if (checkAuth) {
			func(args);
		} else {
			message.error('Drop boc token got expired');
			message.loading('Redirecting to login Page', 3);
			localStorage.clear();
			navigate('/');
		}
	}, []);

	return (
		<div className="app-container">
			<header className="header">
				<h1>Dropbox File Explorer</h1>
			</header>
			<div className="search-container">
				<input
					type="text"
					placeholder="Search files..."
					value={info?.search}
					onChange={(e) =>
						setInfo((prev) => ({
							...prev,
							search: e.target.value,
							searchChanged: true,
						}))
					}
				/>
			</div>
			{info?.loading ? (
				<Spin />
			) : (
				<div className="files-container">
					{info?.filesdata?.length ? (
						info?.filesdata?.map((file) => (
							<div key={file.id} className="file-card">
								<div className="file-info">
									<h3 className="file-name">{file.name}</h3>
									<p className="file-size">
										Size: {formatSize(file.size)}
									</p>
									<p className="file-modified">
										Last Modified:{' '}
										{new Date(
											file.client_modified
										).toLocaleString()}
									</p>
								</div>
								{file.is_downloadable && (
									<div className="file-actions">
										<span className="download-icon">
											⬇️
										</span>
									</div>
								)}
							</div>
						))
					) : (
						<p className="no-files">No files found</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
