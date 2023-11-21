"use client";


import { useState, useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, update, get } from 'firebase/database';
import { auth, db } from '../../components/firebase';
import Navbar from "@/components/navbar";
import './style.css'


const board = ["🤖", "👽", "👻", "🤡", "🐧", "🦚", "😄", "🚀"];
export default function MemoryGame() {
    const [boardData, setBoardData] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (matchedCards.length == 16) {
            setGameOver(true);


            let points;

            if (moves < 20) {
                points = 100;
            } else if (moves < 30) {
                points = 70;
            } else if (moves < 40) {
                points = 50;
            } else {
                points = 10;
            }
            updateProfileScore(points)

        }
    }, [moves]);



    const initialize = () => {
        shuffle();
        setGameOver(false);
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
    };
    const shuffle = () => {
        const shuffledCards = [...board, ...board]
            .sort(() => Math.random() - 0.5)
            .map((v) => v);

        setBoardData(shuffledCards);
    };

    const updateActiveCards = (i) => {
        if (!flippedCards.includes(i)) {
            if (flippedCards.length == 1) {
                const firstIdx = flippedCards[0];
                const secondIdx = i;
                if (boardData[firstIdx] == boardData[secondIdx]) {
                    setMatchedCards((prev) => [...prev, firstIdx, secondIdx]);
                }

                setFlippedCards([...flippedCards, i]);
            } else if (flippedCards.length == 2) {
                setFlippedCards([i]);
            } else {
                setFlippedCards([...flippedCards, i]);
            }

            setMoves((v) => v + 1);
        }
    };


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


            window.alert(`You've won! Please reset to play again`)

    };





    return (
        <div className="min-h-screen flex items-center flex-col justify-center">

            <div className="mb-10 mt-16">
                <p className="font-bold text-4xl">{`Moves - ${moves}`}</p>
            </div>

            <div className="board">
                {boardData.map((data, i) => {
                    const flipped = flippedCards.includes(i) ? true : false;
                    const matched = matchedCards.includes(i) ? true : false;
                    return (
                        <div
                            onClick={() => {
                                updateActiveCards(i);
                            }}
                            key={i}
                            className={`card ${flipped || matched ? "active" : ""} ${matched ? "matched" : ""
                                } ${gameOver ? "gameover" : ""}`}
                        >
                            <div className="card-front">{data}</div>
                            <div className="card-back"></div>
                        </div>
                    );
                })}
            </div>
            <div className="menu">
                <button onClick={() => initialize()} className="reset-btn text-white bg-gray-800 mt-10 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                    Reset
                </button>
            </div>
        </div>
    );
}