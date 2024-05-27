import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Todo from './components/Todo'; 
import Home from './components/Home';
  
  
function App() { 
  const headStyle = { 
    textAlign: "center", 
  } 
  return ( 
    <div> 
      <h1 style={headStyle}>Todo List v4</h1> 
      <BrowserRouter> 
        <Routes> 
          <Route path='/' element={<Home/>}></Route>
          <Route path='/todo' element={<Todo/>}></Route> 
        </Routes> 
      </BrowserRouter> 
    </div> 
  ); 
} 
  
export default App;