import Link from 'next/link';

const DashboardPage = () => {
  const gamesData = [
    { 
      id: 1,
      title: 'Rock Paper Scissors', 
      image: '/rps.webp', 
      link: '/rps', 
      description: 'Play the classic game of Rock Paper Scissors against the computer or a friend.', 
    },
    { 
      id: 2,
      title: 'Tic Tac Toe', 
      image: '/ttt.webp', 
      link: '/ttt', 
      description: 'Challenge a friend in a game of Tic Tac Toe and test your strategic skills.', 
    },
    { 
      id: 3,
      title: 'Memory Game', 
      image: '/mg.webp', 
      link: '/mg', 
      description: 'Exercise your memory with this fun and challenging Memory Game.', 
    },
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      {gamesData.map((game, index) => (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-4 cursor-pointer" key={index}>
          <div className="p-5">
            <img src={game.image} alt={game.title} className="rounded-t-lg" />
            <h5 className="mt-4 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{game.title}</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{game.description}</p>
            <Link href={`/review?game=${(game.id)}`}>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-3">
                Review
              </button>
            </Link>
            <Link href={game.link}>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Play Now
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
