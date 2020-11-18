import React from 'react';
import logo from './logo.svg';
import './App.css';

function getPasswords(): string
{
  return "CLIENT"

  // Get the passwords and store them in state
  // fetch('/api/passwords')
  //   .then(res => res.json())
  //   .then(passwords => return passwords);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {
          getPasswords()
        }
      </header>
    </div>
  );
}

export default App;
