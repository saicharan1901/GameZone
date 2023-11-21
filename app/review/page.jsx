"use client"

import { useState } from 'react';
import Rating from 'react-rating-stars-component';
import { ref, push } from 'firebase/database';
import { db, auth } from '../../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const games = ['Rock Paper Scissors', 'Tic Tac Toe', 'Memory Game']; // Define the available game names

const Review = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [user] = useAuthState(auth);
  const [selectedGame, setSelectedGame] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGame) {
      console.error('Please select a game');
      return;
    }

    const reviewsRef = ref(db, `reviews/${user.uid}`);
    const newReview = {
      game: selectedGame,
      rating,
      description,
      user: user.email,
      name: user.displayName,
    };

    try {
      await push(reviewsRef, newReview);
      setRating(0);
      setDescription('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Review Game</h1>
        <div className="mb-4">
          <Rating
            count={5}
            onChange={(newRating) => setRating(newRating)}
            size={40}
            activeColor="#ffd700"
          />
        </div>
        <div className="mb-4">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4"
          >
            <option value="">Select a game</option>
            {games.map((game, index) => (
              <option key={index} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4"
            placeholder="Write your review here..."
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
