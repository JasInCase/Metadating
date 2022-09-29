import React from 'react';
import FormPage from './Pages/FormPage';
import SideBar from './Components/SideBar';

function App() {
  return (
    <div className="App">
        <div className='flex'>
            <SideBar/>
        </div>
        <FormPage />
    </div>
  );
}

export default App;
