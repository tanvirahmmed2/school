'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers, FiPlus, FiMinus, FiCheck, FiInfo } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch('/api/student/clubs');
        if (res.ok) {
          const data = await res.json();
          setClubs(data.clubs || []);
          setJoinedClubIds(data.joinedClubIds || []);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [reloadTrigger]);

  const handleClubAction = async (clubId, action) => {
    setActionLoadingId(clubId);
    try {
      const res = await fetch('/api/student/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club_id: clubId, action })
      });

      if (res.ok) {
        toast.success(action === 'join' ? 'Joined club successfully!' : 'Left club successfully.');
        setReloadTrigger((prev) => prev + 1);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Action failed.');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setActionLoadingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Clubs & Activities</h1>
        <p className="text-slate-500 text-sm font-medium">Explore co-curricular clubs, manage memberships, and participate in events.</p>
      </div>

      {clubs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 mb-4">
            <FiInfo className="text-3xl" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No Clubs Available</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs">There are no co-curricular clubs registered in the system at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isJoined = joinedClubIds.includes(String(club.id));
            const isLoading = actionLoadingId === club.id;

            return (
              <div
                key={club.id}
                className={`bg-white border transition-all duration-200 rounded-3xl p-6 flex flex-col justify-between ${
                  isJoined ? 'border-blue-100 shadow-md shadow-blue-500/[0.02]' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isJoined ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                      <FiUsers className="text-xl" />
                    </div>
                    {isJoined && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-600">
                        <FiCheck className="text-sm" /> Joined
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{club.name}</h3>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Slug: {club.slug}</p>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
                    {club.description || 'No description provided for this club.'}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  {isJoined ? (
                    <button
                      disabled={isLoading}
                      onClick={() => handleClubAction(club.id, 'leave')}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-red-50 hover:bg-red-100 disabled:bg-slate-50 text-red-600 disabled:text-slate-400 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <FiMinus className="text-sm" />
                      <span>{isLoading ? 'Processing...' : 'Leave Club'}</span>
                    </button>
                  ) : (
                    <button
                      disabled={isLoading}
                      onClick={() => handleClubAction(club.id, 'join')}
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 disabled:shadow-none transition-all cursor-pointer"
                    >
                      <FiPlus className="text-sm" />
                      <span>{isLoading ? 'Processing...' : 'Join Club'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
