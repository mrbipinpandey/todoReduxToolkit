import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch2, fetch3 } from "../helpers/fetch2";

const initialState = [];

export const createTodo = createAsyncThunk("createtodo", async (body) => {
    const result = await fetch2("/createtodo", body);
    return result;
});

export const fetchTodo = createAsyncThunk("fetchtodos", async (body) => {
  const result = await fetch3("/gettodos", "get");
  return result;
});

export const deleteTodo = createAsyncThunk("deletetodos", async (id) => {
  const result = await fetch3(`/remove/${id}`, "delete");
  return result;
});

const todoReducer = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {},
  extraReducers: {
      [createTodo.fulfilled] : (state,action)=>{
        if(action.payload.message){
            state.push(action.payload.message)
        }
      },
      [fetchTodo.fulfilled] : (state,action)=>{
        if(action.payload.message){
            return action.payload.message
        }
      },
      [deleteTodo.fulfilled] : (state,action)=>{
        const removeTodos = state.filter(item=>{
          return item._id != action.payload.message._id
        })
        return removeTodos
      }
  }
});


export default todoReducer.reducer;
