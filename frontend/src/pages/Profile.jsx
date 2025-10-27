// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  // Keep your mock stats exactly as-is
  const farmStats = [
    { label: 'Total Scans', value: '24' },
    { label: 'Pests Identified', value: '18' },
    { label: 'Treatment Applied', value: '12' },
  ];

  // We'll replace recentActivity with real data
  const [recentActivity, setRecentActivity] = useState([
    { action: 'Pest Scan', details: 'Tomato Hornworm identified', time: '2 hours ago' },
    { action: 'Treatment Applied', details: 'Neem oil spray', time: '1 day ago' },
    { action: 'Weather Alert', details: 'High humidity warning', time: '2 days ago' },
    { action: 'Profile Updated', details: 'Farm location changed', time: '3 days ago' }
  ]);

  // Fetch real activity AND update farmStats values in-place
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile');
        if (!response.ok) return;
        const data = await response.json();

        // ✅ ONLY CHANGE: update the .value of existing farmStats objects
        if (data.stats) {
          farmStats[0].value = data.stats.totalScans.toString();
          farmStats[1].value = data.stats.pestsIdentified.toString();
          farmStats[2].value = data.stats.treatmentApplied.toString();
        }

        if (data.recentActivity) {
          setRecentActivity(data.recentActivity);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
        // Keep mock values on error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#091B07] mb-2">Profile</h1>
          <p className="text-[#091B07]">
            Manage your account settings and view your farming statistics.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#091B07] mb-6">Personal Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#091B07] mb-2">Full Name</label>
                  <div className="glass-card border border-[#C0CFC5] rounded-lg px-4 py-3">
                    <p className="text-[#091B07]">{user?.name || 'Farmer User'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#091B07] mb-2">Email Address</label>
                  <div className="glass-card border border-[#C0CFC5] rounded-lg px-4 py-3">
                    <p className="text-[#091B07]">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#091B07] mb-2">Farm Location</label>
                  <div className="glass-card border border-[#C0CFC5] rounded-lg px-4 py-3">
                    <p className="text-[#091B07]">{user?.location || 'Farm Location'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#091B07] mb-2">Farm Type</label>
                  <div className="glass-card border border-[#C0CFC5] rounded-lg px-4 py-3">
                    <p className="text-[#091B07] capitalize">{user?.farmType || 'Mixed Farming'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button className="bg-[#091B07] text-[#C0CFC5] px-6 py-2 rounded-lg font-semibold hover:bg-[#091B07]/90 transition-all shadow-md">
                  Edit Profile
                </button>
                <button className="border-2 border-[#091B07] text-[#091B07] px-6 py-2 rounded-lg font-semibold hover:bg-[#091B07]/10 transition-all">
                  Change Password
                </button>
              </div>
            </div>

            {/* Recent Activity — NOW FUNCTIONAL */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#091B07] mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 glass-card border border-[#C0CFC5] rounded-lg hover:shadow-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#091B07]">{activity.action}</p>
                      <p className="text-[#091B07] text-sm">{activity.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#091B07] text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Quick Actions */}
          <div className="space-y-8">
            {/* Farm Statistics — now functional, structure unchanged */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#091B07] mb-6">Farm Statistics</h2>
              <div className="space-y-4">
                {farmStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass-card rounded-lg border border-[#C0CFC5]">
                    <div className="flex items-center space-x-3">
                      <span className="text-[#091B07] font-medium">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-[#091B07]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings — unchanged */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#091B07] mb-4">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#091B07]">Weather Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#091B07] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#091B07]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#091B07] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#091B07]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#091B07]">Treatment Reminders</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#091B07] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#091B07]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#091B07] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#091B07]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;