import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/O-modified.png';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Basic weather insights for your farm',
      features: [
        '7-day weather forecast',
        'Basic risk assessment',
        'Immediate climate alerts',
        'General farming advice',
        'Share & print reports',
        'Unlimited location checks'
      ],
      cta: 'Get Started Free',
      popular: false,
      link: '/'
    },
    {
      name: 'Grower',
      price: 'R50',
      period: '/month',
      description: 'Advanced pest prevention for serious farmers',
      features: [
        'Everything in Starter plan',
        'Early Warning System (3-5 day pest alerts)',
        'Seasonal Pest Forecasting',
        'Custom Alert Thresholds (up to 3)',
        'Basic Soil Analysis Integration',
        'WhatsApp alerts',
        'Save historical reports'
      ],
      cta: 'Start Growing',
      popular: true,
      link: '/signup'
    },
    {
      name: 'Commercial',
      price: 'R150',
      period: '/month',
      description: 'Complete farm management solution',
      features: [
        'Everything in Grower plan',
        'Premium Early Warnings (5-7 day alerts)',
        'Hyper-local Seasonal Forecasts',
        'Unlimited Custom Alerts',
        'Advanced Soil Analysis',
        'Multi-season analytics',
        'API Access',
        'Expert consultation (2 hours/month)'
      ],
      cta: 'Go Commercial',
      popular: false,
      link: '/signup'
    }
  ];

  return (
    <div className="min-h-screen bg-[#C0CFC5] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#091B07] rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src={logo} 
                alt="Crop Shield Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#091B07] font-sans-serif mb-4">
            Choose Your Protection Plan
          </h1>
          <p className="text-xl text-[#091B07]/80 max-w-2xl mx-auto">
            Start with free basic weather insights or upgrade to get advanced pest warnings and seasonal forecasts
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:transform hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-[#091B07] text-[#C0CFC5] border-2 border-[#C0CFC5] shadow-2xl'
                  : 'bg-white/80 text-[#091B07] border border-[#091B07]/20 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#C0CFC5] text-[#091B07] px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-[#C0CFC5]' : 'text-[#091B07]'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`ml-1 text-lg ${plan.popular ? 'text-[#C0CFC5]/80' : 'text-[#091B07]/60'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.popular ? 'text-[#C0CFC5]/80' : 'text-[#091B07]/60'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                      plan.popular ? 'bg-[#C0CFC5]' : 'bg-[#091B07]'
                    }`}></span>
                    <span className={`text-sm ${plan.popular ? 'text-[#C0CFC5]' : 'text-[#091B07]'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={plan.link}
                className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  plan.popular
                    ? 'bg-[#C0CFC5] text-[#091B07] hover:bg-[#C0CFC5]/90'
                    : 'bg-[#091B07] text-[#C0CFC5] hover:bg-[#091B07]/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-[#091B07] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#091B07] mb-2">Can I cancel anytime?</h3>
              <p className="text-[#091B07]/80 text-sm">Yes, cancel your subscription anytime with no hidden fees.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#091B07] mb-2">Is there a free trial?</h3>
              <p className="text-[#091B07]/80 text-sm">All paid plans include a 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#091B07] mb-2">How accurate are the pest warnings?</h3>
              <p className="text-[#091B07]/80 text-sm">Our early warning system has 85% accuracy based on weather patterns and historical pest data.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#091B07] mb-2">What crops do you support?</h3>
              <p className="text-[#091B07]/80 text-sm">We support all major South African crops including maize, sugarcane, citrus, and vegetables.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-[#091B07] mb-4">
            Need a custom plan for your farming cooperative?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border-2 border-[#091B07] text-[#091B07] rounded-xl font-semibold hover:bg-[#091B07] hover:text-[#C0CFC5] transition-all duration-300"
          >
            Contact Our Farm Experts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;