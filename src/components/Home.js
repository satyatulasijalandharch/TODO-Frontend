import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="Home">
      <h1>Hello, world from Satya</h1>
      <Link to="/Todo">
        <button>Go to Another Page</button>
      </Link>
    </div>
  );
}

export default Home;
