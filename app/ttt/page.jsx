"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import './style.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, update, get } from 'firebase/database';
import { auth, db } from '../../components/firebase';

const WINNING_COMBO = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export default function Home() {
  const [xTurn, setXTurn] = useState(true);
  const [won, setWon] = useState(false);
  const [wonCombo, setWonCombo] = useState([]);
  const [boardData, setBoardData] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
  });
  const [isDraw, setIsDraw] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  useEffect(() => {
    checkWinner();
    checkDraw();
  }, [boardData]);
  const updateBoardData = (idx) => {
    if (!boardData[idx] && !won) {
      //will check whether specify idx is empty or not
      let value = xTurn === true ? "X" : "O";
      setBoardData({ ...boardData, [idx]: value });
      setXTurn(!xTurn);
    }
  };
  const checkWinner = () => {
    WINNING_COMBO.forEach((bd) => {
      const [a, b, c] = bd;
      if (
        boardData[a] &&
        boardData[a] === boardData[b] &&
        boardData[a] === boardData[c]
      ) {
        setWon(true);
        updateProfileScore(10); // If someone wins, update score by 10
        setWonCombo([a, b, c]);
        setModalTitle(`Player ${!xTurn ? "X" : "O"} Won!!!`);
        return;

        
      }
    });
  };
  
  const checkDraw = () => {
    let check = Object.keys(boardData).every((v) => boardData[v]);
    setIsDraw(check);
  
    if (check) {
      setModalTitle("Match Draw!!!");
      updateProfileScore(5); // If it's a tie, update score by 5
      
    }
  };
  const reset = () => {
    setBoardData({
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
    });
    setXTurn(true);
    setWon(false);
    setWonCombo([]);
    setIsDraw(false);
    setModalTitle("");
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
        setSells([]);
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

  return (
    <div className="min-h-screen flex items-center flex-col justify-center">
      <Head>
        <title>Tic Tac Toe</title>
      </Head>
      <div className="game">
        <div className="game__menu">
          <p className="font-bold mb-10 text-3xl ">{xTurn === true ? "X Turn" : "O Turn"}</p>
        </div>
        <div className="game__board">
          {[...Array(9)].map((v, idx) => {
            return (
              <div
                onClick={() => {
                  updateBoardData(idx);
                }}
                key={idx}
                className={`square ${
                  wonCombo.includes(idx) ? "highlight" : ""
                }`}
              >
                {boardData[idx]}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`modal ${modalTitle ? "show" : ""}`}>
        <div className="modal__title">{modalTitle}</div>
        <button onClick={reset}>New Game</button>
      </div>
    </div>
  );
}