"use client"

import React from 'react';
import Link from 'next/link';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/components/firebase';
import Navbar from '@/components/navbar';

const Home = () => {
  const [user] = useAuthState(auth);

  const googleAuth = new GoogleAuthProvider();
  const login = async () => {
    const results = await signInWithPopup(auth, googleAuth);
    const { user } = results;
    const userInfo = {
      name: user.displayName,
      email: user.email,
      image: user.photoURL
    };
    // Do something with userInfo, if needed
  };

  return (
    <div className="min-h-screen mt-24">
      <Navbar />

      <div className="container mx-auto py-8">
        <div className="bg-white p-4 md:p-8 rounded shadow-md md:w-96 mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-4">
            Welcome to GameZone!
          </h1>
          <img src="./home.webp" alt="Image description" className="mb-4 h-24 w-24 mx-auto" />
          <p className="text-gray-800 text-sm md:text-base">
            Are you looking for a place to escape from the everyday world? Do you want to be challenged and entertained? If so, then you've come to the right place. Our website is home to a vast collection of games, from classic favorites to the latest releases. We have something for everyone, whether you're a casual gamer or a hardcore enthusiast.
            So what are you waiting for? Start exploring our site today!
          </p>
          {!user ? (
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded  md:mt-6"
            >
              Get. Set. Game!
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded  md:mt-6"
            >
              Get to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
