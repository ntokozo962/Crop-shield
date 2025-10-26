import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  setSelectedImage(imageUrl);
  setIsAnalyzing(true);
  setAnalysisResult(null);

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Scan failed');
    }

    // Map backend response to your UI format
    setAnalysisResult({
      pestName: data.common_name,
      confidence: data.confidence_percent,
      treatment: data.treatment_guidance,
      severity: 'high' // optional: you can add severity later
    });
  } catch (err) {
    console.error('Scan error:', err);
    alert('Failed to analyze image. Please try again.');
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <div className="min-h-screen bg-[#C0CFC5] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#091B07] mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-[#091B07]">
            Upload an image to identify pests and get treatment recommendations.
          </p>
        </div>

        {/* Pest Identification Card */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#091B07] mb-6 text-center">Pest Identification</h2>
          
          {!selectedImage ? (
            <div className="border-2 border-dashed border-[#C0CFC5] rounded-2xl p-8 text-center hover:border-[#C0CFC5] transition-colors">
              <h3 className="text-xl font-semibold text-[#091B07] mb-2">
                Upload Pest Image
              </h3>
              <p className="text-[#091B07] mb-8">
                Upload an image of the pest for AI analysis
              </p>
              <div className="flex justify-center">
                <label className="cursor-pointer bg-[#091B07] text-[#C0CFC5] px-8 py-4 rounded-lg font-semibold hover:bg-[#091B07]/90 transition-all shadow-md text-lg">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#C0CFC5]">
                <img 
                  src={selectedImage} 
                  alt="Uploaded pest" 
                  className="w-full h-64 object-cover"
                />
              </div>
              
              {/* Analysis Results */}
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#091B07] mx-auto mb-4"></div>
                  <p className="text-[#091B07]">Analyzing image with AI...</p>
                </div>
              ) : analysisResult && (
                <div className="glass-card rounded-2xl p-6 border border-[#C0CFC5]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-bold text-[#091B07]">
                      {analysisResult.pestName}
                    </h3>
                    <span className="bg-[#091B07] text-[#C0CFC5] px-4 py-2 rounded-full text-sm font-semibold">
                      {analysisResult.confidence}% Confidence
                    </span>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#091B07] mb-3">Treatment Guide:</h4>
                    <p className="text-[#091B07] bg-[#C0CFC5] rounded-lg p-4 border border-[#091B07]/20">
                      {analysisResult.treatment}
                    </p>
                  </div>
                  <button 
  onClick={() => {
    setSelectedImage(null);
    setAnalysisResult(null);
    // Optional: clean up object URL to prevent memory leak
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
  }}
  className="w-full bg-[#091B07] text-[#C0CFC5] py-4 rounded-lg font-semibold hover:bg-[#091B07]/90 transition-all shadow-md text-lg"
>
  Scan Another Pest
</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#091B07] mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="text-center p-6 bg-[#C0CFC5] rounded-2xl border border-[#091B07]/20">
              <div className="w-16 h-16 bg-[#091B07] text-[#C0CFC5] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#091B07] mb-3">Upload Image</h3>
              <p className="text-[#091B07]">
                Take a clear photo of the pest or affected plant leaves. Make sure the image is well-lit and focused.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-[#C0CFC5] rounded-2xl border border-[#091B07]/20">
              <div className="w-16 h-16 bg-[#091B07] text-[#C0CFC5] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#091B07] mb-3">AI Analysis</h3>
              <p className="text-[#091B07]">
                Our advanced AI model analyzes the image to identify the pest species and assess the severity of infestation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-[#C0CFC5] rounded-2xl border border-[#091B07]/20">
              <div className="w-16 h-16 bg-[#091B07] text-[#C0CFC5] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#091B07] mb-3">Get Treatment</h3>
              <p className="text-[#091B07]">
                Receive immediate, farm-specific treatment recommendations and preventive measures to protect your crops.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-[#091B07] rounded-2xl">
            <h3 className="text-xl font-semibold text-[#C0CFC5] mb-4 text-center">
              Tips for Best Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#C0CFC5] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-[#C0CFC5] text-sm">Use natural lighting for clearer images</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#C0CFC5] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-[#C0CFC5] text-sm">Include both close-up and wider shots if possible</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#C0CFC5] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-[#C0CFC5] text-sm">Capture multiple angles of the affected area</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#C0CFC5] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p className="text-[#C0CFC5] text-sm">Upload images as soon as you notice pest activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;