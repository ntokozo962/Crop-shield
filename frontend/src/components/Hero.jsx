import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Farm Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("src/assets/lush-green-plants-thriving-greenhouse-bathed-sunlight-showing-vibrant-foliage-water-droplets.jpg")',
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight font-zen-dots">
            CROP
            <span className="block text-[#091B07]">SHIELD</span>
          </h1>

          {/* Subheading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 max-w-2xl mx-auto leading-relaxed">
            AI-Powered Crop Protection for Modern Farmers
          </h2>

          {/* Paragraph */}
          <p className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
            Identify pests in seconds with advanced AI, get instant treatment recommendations, 
            and protect your crops from weather risks. Join thousands of farmers who trust Crop Shield.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <Link
              to="/auth"
              className="group bg-[#091B07] text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-[#091B07]/90 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 inline-flex items-center glass"
            >
              Start Protecting Your Crops
              
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-12 glass-card rounded-2xl py-6 px-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-white font-medium">Trusted Farmers</div>
            </div>
            <div className="w-px h-12 bg-[#C0CFC5]/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white font-medium">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative bg-[#C0CFC5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#091B07] mb-12 text-center font-sans-serif">FEATURES</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Pest Detection',
                description: 'Upload images of pests and get instant identification with confidence scores and treatment recommendations.'
              },
              {
                title: 'Weather Alerts',
                description: 'Real-time weather monitoring and risk alerts to protect your crops from environmental threats.'
              },
              {
                title: 'Scan History',
                description: 'Keep track of all your pest scans with detailed treatment history and progress tracking.'

              }
            ].map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#091B07] mb-3">{feature.title}</h3>
                <p className="text-[#091B07] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative bg-[#7D8E7B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#091B07] mb-12 text-center font-sans-serif">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Upload', description: 'Upload an image of the pest' },
              { step: '2', title: 'Analyze', description: 'Our AI analyzes the image in seconds' },
              { step: '3', title: 'Identify', description: 'Get pest identification with confidence score' },
              { step: '4', title: 'Treat', description: 'Receive personalized treatment recommendations' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#091B07] text-[#C0CFC5] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#091B07] mb-2">{step.title}</h3>
                <p className="text-[#091B07] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;