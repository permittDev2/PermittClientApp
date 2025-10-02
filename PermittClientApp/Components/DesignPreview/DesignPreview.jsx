import React, { useMemo, useEffect, useState } from 'react';
import { getApiUrl, getAiUrl } from '../../src/config/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function DesignPreview() {
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams();
	const { aiData: stateAiData, formData } = location.state || {};
	const [aiData, setAiData] = useState(stateAiData || null);
	const designId = params.id;

	useEffect(() => {
		if (aiData || !designId || designId === 'preview') return;
		const token = localStorage.getItem('token');
		const fetchData = async () => {
            try {
                const res = await fetch(getApiUrl(`design/${designId}`), {
					headers: {
						'Authorization': token ? `Bearer ${token}` : undefined
					}
				});
				if (!res.ok) throw new Error(`Failed to load design ${designId}`);
				const json = await res.json();
				setAiData(json);
			} catch (e) {
				console.error(e);
			}
		};
		fetchData();
	}, [aiData, designId]);

	const [preferences, setPreferences] = useState(null);
	const [preferencesImageUrl, setPreferencesImageUrl] = useState(null);

	const preferencesId = useMemo(() => {
		return aiData?.preferencesId || aiData?.designPreferencesId || aiData?.preferences?.id || null;
	}, [aiData]);

	useEffect(() => {
		if (!preferencesId) return;

		let isCancelled = false;
		const token = localStorage.getItem('token');
		const loadPreferences = async () => {
	            try {
	                const res = await fetch(getApiUrl(`Preferences/${preferencesId}`), {
					headers: {
						'Authorization': token ? `Bearer ${token}` : undefined
					}
				});
				if (!res.ok) throw new Error(`Failed to load preferences ${preferencesId}`);
				const json = await res.json();
				if (!isCancelled) setPreferences(json);
			} catch (err) {
				console.error(err);
			}
		};
		loadPreferences();
		return () => { isCancelled = true; };
	}, [preferencesId]);

	useEffect(() => {
		if (!preferencesId) return;

		let isCancelled = false;
		let objectUrl = null;
		const token = localStorage.getItem('token');
		const loadImage = async () => {
			try {
				const res = await fetch(getAiUrl(`images/${preferencesId}`), {
					headers: {
						'Authorization': token ? `Bearer ${token}` : undefined
					}
				});
				if (!res.ok) throw new Error(`Failed to load image for preferences ${preferencesId}`);
				const blob = await res.blob();
				if (isCancelled) return;
				objectUrl = URL.createObjectURL(blob);
				setPreferencesImageUrl(objectUrl);
			} catch (err) {
				console.error(err);
			}
		};
		loadImage();
		return () => {
			isCancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [preferencesId]);

	const { imageUrl, base64Image, contentType } = useMemo(() => {
		if (!aiData) return {};
		return {
			imageUrl: aiData.imageUrl || aiData.image_url || aiData.image || null,
			base64Image: aiData.base64Image || aiData.base64_image || null,
			contentType: aiData.contentType || aiData.content_type || null
		};
	}, [aiData]);

	const hasAnyPreview = !!(preferencesImageUrl || imageUrl || base64Image);

	const buildDataUrl = (b64, typeHint) => {
		if (!b64) return null;
		const mime = typeHint || 'image/png';
		return `data:${mime};base64,${b64}`;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">Your AI-generated Design</h1>
					<div className="space-x-2">
						<button onClick={() => navigate('/property-wizard')} className="px-4 py-2 bg-gray-200 rounded-md">Back to Wizard</button>
						<button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded-md">Go to Dashboard</button>
					</div>
				</div>

			{!hasAnyPreview && (
				<div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
					<p>No preview data provided. Please submit the wizard to generate a design.</p>
				</div>
			)}

			{(preferencesImageUrl || imageUrl || base64Image) && (
				<div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
					<img
						src={preferencesImageUrl || imageUrl || buildDataUrl(base64Image, contentType || 'image/png')}
						alt="AI generated floor plan"
						className="w-full h-auto rounded"
					/>
				</div>
			)}



			{formData && (
				<div className="mt-6 text-sm text-gray-600">
					<h2 className="font-semibold mb-2">Submitted Parameters</h2>
					<pre className="bg-gray-100 p-3 rounded overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
				</div>
			)}

			{preferences && (
				<div className="mt-6 text-sm text-gray-600">
					<h2 className="font-semibold mb-2">Preferences (from database)</h2>
					<pre className="bg-gray-100 p-3 rounded overflow-x-auto">{JSON.stringify(preferences, null, 2)}</pre>
				</div>
			)}
		</div>
	</div>
	);
}

export default DesignPreview;


