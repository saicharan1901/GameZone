"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, update, get } from 'firebase/database';
import { auth, db } from '../../components/firebase';
import Navbar from '../../components/navbar';


const choices = ['rock', 'paper', 'scissors'];

const Home = () => {
  const [playerChoice, setPlayerChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [sells, setSells] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      return;
    }
  
    const profileRef = ref(db, `profiles/${user.uid}`);
    const fetchData = async () => {
      const snapshot = await get(profileRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSells(data.sells || []);
      } else {
        // If the profile doesn't exist, create a new one
        const newProfile = {
          score: 0, // Initial score for a new profile
          level: 1, // Initial level
          email: user.email,
          name: user.displayName,
        };
  
        // Set the new profile data in the database
        try {
          await update(profileRef, newProfile);
          setSells([]); // Assuming sells data is empty for a new profile
        } catch (error) {
          console.error('Error creating new profile:', error);
        }
      }
    };
    fetchData();
  }, [user]);
  

  const updateProfileScore = (score) => {
    if (!user) return;

    const profileRef = ref(db, `profiles/${user.uid}`);

    get(profileRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const currentProfile = snapshot.val();
          let currentScore = currentProfile.score || 0;
          currentScore += score;

          const level = Math.floor(currentScore / 100) + 1; // Calculate level based on score

          const updates = {
            score: currentScore,
            level,
            email: user.email,
            name: user.displayName,
          };

          update(profileRef, updates);
        } else {
          console.log('User profile not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  };




  const determineWinner = (player, computer) => {
    if (player === computer) {
      setResult("It's a tie!");
      updateProfileScore(2); // +2 if tie
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'scissors' && computer === 'paper') ||
      (player === 'paper' && computer === 'rock')
    ) {
      setResult('You win!');
      updateProfileScore(10); // +10 if win
    } else {
      setResult('You lose!');
      updateProfileScore(0); // +0 if lose
    }
  };

  const displayHands = (playerChoice, computerChoice) => {
    setPlayerChoice(playerChoice);
    setComputerChoice(computerChoice);
  };

  const handleChoiceClick = (choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    displayHands(choice, computerChoice);
    determineWinner(choice, computerChoice);
  };


  return (
    <div className="min-h-screen flex items-center justify-center scdo ">

      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold">Rock, Paper, Scissors</h1>

        <div className="mt-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-24 text-4xl" id="player-hand">
              {playerChoice === 'rock' && '✊'}
              {playerChoice === 'paper' && '🖐️'}
              {playerChoice === 'scissors' && '✌️'}
            </div>
            <div className="w-24 text-4xl" id="computer-hand">
              {computerChoice === 'rock' && '✊'}
              {computerChoice === 'paper' && '🖐️'}
              {computerChoice === 'scissors' && '✌️'}
            </div>
          </div>
        </div>

        <div className="mt-6 text-2xl font-semibold" id="result">
          {result}
        </div>

        <div className="mt-6 space-x-4">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceClick(choice)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
