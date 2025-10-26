// frontend/src/components/PestScanner.jsx
import { useState, useRef } from 'react';

export default function PestScanner() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // To reset input

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        body: formData,
        // ⚠️ DO NOT set Content-Type — browser sets it automatically with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResult(data);
    } catch (err) {
      console.error('Scan failed:', err);
      alert('Failed to identify pest. Please try again.');
    } finally {
      setLoading(false);
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScanAnother = () => {
    if (image) {
      URL.revokeObjectURL(image); // Clean up memory
    }
    setResult(null);
    setImage(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-green-800 mb-4">AI Pest Identifier</h2>

      {!result && !loading && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload a clear photo of the pest:
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-sm p-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">🔍 Analyzing... AI is identifying the pest</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="Uploaded pest"
                className="mx-auto max-h-40 object-contain border rounded mb-3"
              />
            </div>
          )}

          <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
            <div>
              <span className="text-sm text-gray-500">Pest Identified:</span>
              <p className="text-lg font-semibold text-green-800">{result.common_name}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Confidence:</span>
              <p className="font-mono text-lg">{result.confidence_percent}%</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Treatment:</span>
              <p className="mt-1">{result.treatment_guidance}</p>
            </div>
          </div>

          <button
            onClick={handleScanAnother}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition"
          >
            🔄 Scan Another Pest
          </button>
        </div>
      )}
    </div>
  );
}