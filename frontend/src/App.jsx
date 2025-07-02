import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import MCQ from "./assets/Component/MCQ/MCQ";
import TrueFalse from "./assets/Component/TrueFalse/TrueFalse";
import MarkTheWord from "./assets/Component/MarkTheWord/MarkTheWord";
import ImageMCQ from "./assets/Component/ImageMCQ/ImageMCQ";
import DragAndDrop from "./assets/Component/DragAndDrop/DragAndDrop";
import FillInTheBlank from "./assets/Component/FillInTheBlank/FillInTheBlank";
import Essay from "./assets/Component/Essay/Essay";
import SortParagraph from "./assets/Component/SortParagraph/SortParagraph";

function ResultPage() {
	const [result, setResult] = useState(null);
	const [type, setType] = useState("");
	const [name, setName] = useState("");
	const [previewImage, setPreviewImage] = useState("")

	useEffect(() => {
		const stored = sessionStorage.getItem("resultData");
		const imgStr = sessionStorage.getItem("previewImage")
		if (stored) {
			const parsed = JSON.parse(stored);
			setResult(parsed.result);
			setType(parsed.type);
			setName(parsed.name);
		}
		if(imgStr) {
			setPreviewImage(atob(imgStr))
		}
	}, []);



	if (!result) return <div className="results-section"><h3>لا توجد نتائج</h3></div>;

	return (
		<div className="results-section">
			<h3>Processed Results</h3>
			{type === "MCQ" && (
				<MCQ data={result} />
			)}
			{type === "True False" && (
				<TrueFalse data={result} />
			)}
			{type === "Mark the Word" && (
				<MarkTheWord data={result} />
			)}
			{type === "Image MCQ" && (
				<ImageMCQ data={result} />
			)}
			{type === "Text Drag Word" && (
				<DragAndDrop data={result} />
			)}
			{type === "Fill in the Blank" && (
				<FillInTheBlank data={result} />
			)}
			{type === "Essay" && (
				<Essay data={result} />
			)}
			{type === "Sort Paragraph" && (
				<SortParagraph data={result} />
			)}
		</div>
	);
}

function App() {
	const [type, setType] = useState("");
	const [jsonResponseText, setJsonResponseText] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			const imageFile = event.target.files[0];
			setSelectedImage(imageFile);
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(imageFile);
		} else {
			setPreviewImage(null);
		}
	};

	const processImage = async () => {
		if (!selectedImage) {
			setError("Please select an image first");
			return;
		}
		if (!type) {
			setError("Please select a type");
			return;
		}

		setIsProcessing(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("file", selectedImage);
			formData.append("type", type);

			const response = await fetch("http://localhost:3001/process-images", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Store result in sessionStorage and open result page in new tab
			const resultId = Date.now();
			sessionStorage.setItem(
				"resultData",
				JSON.stringify({ result: data.result, type, name })
			);
			sessionStorage.setItem("previewImage", btoa(previewImage))
			const url = `/result/${encodeURIComponent(type)}/${resultId}`;
			window.open(url, '_blank');

			// Set the final JSON for display
			setJsonResponseText(JSON.stringify(data.result, null, 2));
		} catch (error) {
			console.error("Error processing image:", error);
			setError(`Error processing image: ${error.message}`);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Routes>
			<Route
				path="/"
				element={
					<div className="app-container app-container-wide">
						<main className="app-main">
							<div className="form-header">
								<div className="type-section">
									<label htmlFor="type">Type:</label>
									<select
										id="type"
										value={type}
										onChange={(e) => setType(e.target.value)}
										className="type-select"
									>
										<option value="">-- Select an option --</option>
										<option value="MCQ">MCQ</option>
										<option value="Image MCQ">Image MCQ</option>
										<option value="Fill in the Blank">Fill in the Blank</option>
										<option value="Text Drag Word">Text Drag Word</option>
										<option value="Sort Paragraph">Sort Paragraph</option>
										<option value="True False">True False</option>
										<option value="Mark the Word">Mark the Word</option>
										<option value="Essay">Essay</option>
									</select>
								</div>
							</div>
							<div className="upload-actions">
								<input
									type="file"
									id="imageUpload"
									accept="image/*"
									onChange={handleImageChange}
									style={{ display: "none" }}
									className="visually-hidden"
								/>
								<button
									className="upload-images-button"
									onClick={() => document.getElementById("imageUpload").click()}
								>
									📤 UPLOAD IMAGE
								</button>
							</div>
							{previewImage && (
								<div className="image-preview">
									<h3>Preview Image</h3>
									<img src={previewImage} alt="Preview" />
								</div>
							)}
							{error && (
								<div className="error-message">
									<p>{error}</p>
								</div>
							)}
							<div className="submit-section">
								<button className="submit-button" onClick={processImage} disabled={isProcessing || !selectedImage}>
									{isProcessing ? "Creating..." : "Create Object"}
								</button>
							</div>
							{jsonResponseText && (
								<div className="json-preview-block">
									<label>JSON</label>
									<pre className="json-block"><code>{jsonResponseText}</code></pre>
								</div>
							)}
						</main>
					</div>
				}
			/>
			<Route path="/result/:type/:id" element={<ResultPage />} />
		</Routes>
	);
}

export default App;
