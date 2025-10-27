import { useState, useEffect } from 'react';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setScans(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleViewDetails = (scan) => {
    const details = `
Pest: ${scan.pest_name || 'Unknown Pest'}
Confidence: ${scan.confidence_percent}%
Status: ${getStatusText(scan.status)}
Scanned: ${new Date(scan.scanned_at).toLocaleString()}
Treatment: ${scan.treatment_guidance || 'No treatment guidance available. Please consult an agronomist.'}
    `.trim();
    alert(details);
  };

  const updateStatus = async (scanId) => {
    // Optimistic UI update
    setScans(prev =>
      prev.map(scan =>
        scan.id === scanId ? { ...scan, status: 'treated' } : scan
      )
    );

    try {
      const response = await fetch(`http://localhost:5000/api/scans/${scanId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'treated' })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to mark as treated. Please try again.');
      // Revert on error
      setScans(prev =>
        prev.map(scan =>
          scan.id === scanId ? { ...scan, status: 'pending' } : scan
        )
      );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'treated': return 'Treatment Applied';
      case 'pending': return 'Awaiting Action';
      default: return 'Awaiting Action';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'treated':
        return 'bg-[#C0CFC5] text-[#091B07] border border-[#091B07]/30';
      case 'pending':
        return 'bg-gray-100 text-[#091B07] border border-gray-300';
      default:
        return 'bg-gray-100 text-[#091B07]';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#C0CFC5] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#091B07] mb-2">Scan History</h1>
          <p className="text-[#091B07]">
            Review your pest identification history and treatment records
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-6xl mb-2">⏳</div>
            <h3 className="text-xl font-semibold text-[#091B07] mb-3">
              Loading your scan history...
            </h3>
          </div>
        )}

        {/* Scan list */}
        {!loading && (
          <div className="grid gap-6">
            {scans.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-semibold text-[#091B07] mb-3">No Scan History Yet</h3>
                  <p className="text-[#091B07] mb-6">
                    Start protecting your crops by uploading your first pest image for analysis.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-[#091B07] text-[#C0CFC5] px-8 py-3 rounded-xl font-semibold hover:bg-[#091B07]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Scan Your First Pest
                  </button>
                </div>
              </div>
            ) : (
              scans.map((scan) => (
                <div key={scan.id} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-64 lg:h-48 w-full h-56 flex-shrink-0">
                      <img 
                        src={`http://localhost:5000${scan.image_url}`} 
                        alt={`Pest: ${scan.pest_name || 'Unknown'}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                        className="w-full h-full object-cover rounded-xl border-2 border-[#C0CFC5] shadow-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#091B07] mb-1">
                            {scan.pest_name || 'Unknown Pest'}
                          </h3>
                          <p className="text-[#091B07] text-sm">
                            Scanned on {formatDate(scan.scanned_at)}
                          </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="bg-[#091B07] text-[#C0CFC5] px-3 py-1 rounded-full text-sm font-semibold w-fit">
                            {scan.confidence_percent}% Confidence
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(scan.status)}`}>
                            {getStatusText(scan.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-[#091B07] mb-2 text-lg">Treatment Plan</h4>
                        <div className="bg-[#C0CFC5] rounded-lg p-4 border border-[#091B07]/20">
                          <p className="text-[#091B07] leading-relaxed">
                            {scan.treatment_guidance || 'No treatment guidance available. Please consult an agronomist.'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {scan.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(scan.id)}
                            className="bg-[#091B07] text-[#C0CFC5] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#091B07]/90 transition"
                          >
                            Mark as Treated
                          </button>
                        )}
                        <button 
                          onClick={() => handleViewDetails(scan)}
                          className="text-[#091B07] hover:text-[#091B07]/80 font-medium text-sm border border-[#091B07] px-4 py-2 rounded-lg hover:bg-[#091B07]/10 transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Scan Summary — always visible */}
        <div className="mt-8 glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#091B07] mb-4">Scan Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#091B07]">{scans.length}</div>
              <div className="text-[#091B07] text-sm">Total Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#091B07]">
                {scans.filter(s => s.pest_name).length}
              </div>
              <div className="text-[#091B07] text-sm">Pests Identified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#091B07]">
                {scans.filter(s => s.status === 'treated').length}
              </div>
              <div className="text-[#091B07] text-sm">Treatment Applied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
