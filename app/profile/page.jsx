"use client";


import React, { useState, useEffect } from 'react';
import { auth, db } from '../../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import HorizontalBarChart from 'react-horizontal-stacked-bar-chart';
import { ToastContainer, toast } from 'react-toastify';
import { ref, update, get } from 'firebase/database';
import 'react-toastify/dist/ReactToastify.css';
import { FiUser, FiMail } from 'react-icons/fi';

const Profile = () => {
  const [user] = useAuthState(auth);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const maxScoreInLevel = 100; // Maximum score in a level

  useEffect(() => {
    if (!user) return;

    const profileRef = ref(db, `profiles/${user.uid}`);
    get(profileRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userProfile = snapshot.val();
          const currentScore = userProfile.score || 0;
          setScore(currentScore);
          const currentLevel = Math.floor(currentScore / maxScoreInLevel) + 1;
          setLevel(currentLevel);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [user]);

  const scoreWithinLevel = score % maxScoreInLevel;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <main className="flex flex-col items-center mt-8">
        {user && (
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <img
                src={user.photoURL}
                alt="Profile"
                className="avatar rounded-full w-20 h-20 mr-4"
              />
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{user.displayName}</p>
                <p className="flex items-center text-gray-500">
                  <FiMail className="mr-1" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-lg mb-2">Level: {level}</p>
              <HorizontalBarChart
                data={[
                  { value: scoreWithinLevel, color: '#3498db' },
                  { value: maxScoreInLevel - scoreWithinLevel, color: '#d6d6d6' },
                ]}
                showTextIn
                height={20}
              />
              <p className="text-center mt-2 text-sm text-gray-500">
                {scoreWithinLevel} / {maxScoreInLevel}
              </p>
            </div>
          </div>
        )}

        {/* Add more profile details or components */}
      </main>
      <ToastContainer />
    </div>
  );
};

export default Profile;
