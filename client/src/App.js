import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Auth from './components/Auth';
import Todo from './components/Todo';
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from './reducers/authReducer';

function App() {
  const dispatch = useDispatch()

  
  const token = useSelector((state)=>{
    return state.user.token
  })

  useEffect(()=>{
    dispatch(addToken())
  },[])
  
  return (
    <div className="App">
      {
        token ? <Todo/> :  <Auth/>
      }
     
      
    </div>
  );
}

export default App;
