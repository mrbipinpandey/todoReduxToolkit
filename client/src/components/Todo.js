import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/authReducer";
import { createTodo, deleteTodo, fetchTodo } from "../reducers/todoReducer";

function Todo() {
  const [mytodo, setTodo] = useState("");
  const dispatch = useDispatch();

  const todos = useSelector((state) => {
    return state.todos;
  });

  const addTodo = () => {
    dispatch(createTodo({ todo: mytodo }));
  };

  useEffect(()=>{
    dispatch(fetchTodo())
  },[])
  return (
    <div>
      <input
        placeholder="write todo here"
        value={mytodo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button className="btn #ff4081 pink accent-2" onClick={() => addTodo()}>
        Add Todo
      </button>

      <ul className="collection">
        {
          todos.map(item=>{
            return <li className="collection-item" onClick={()=>dispatch(deleteTodo(item._id))} key={item._id}>{item.todo}</li> 
          })
        }
           
      </ul>

      <button className="btn #ff4081 pink accent-2" onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
}

export default Todo;
