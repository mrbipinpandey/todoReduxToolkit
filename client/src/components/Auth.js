import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import {signupUser,signinUser} from '../reducers/authReducer'

function Auth() {

    const dispatch =  useDispatch()
    const {loading,error} =  useSelector(state=>{
        return state.user
    })

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("signin");
  
  const authenticate = ()=>{
      if(auth == 'signin'){
        dispatch(signinUser({email,password}))
      }else{
        dispatch(signupUser({email,password}))
      }
  }
  return (
    <div>
        {loading && 
          <div className="progress">
                <div className="indeterminate"></div>
          </div>
                        
        }
      <h1> please {auth}!</h1>
      {error && 
          <h5>{error}</h5>
                        
        }
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    {
        auth == "signin" ?
        <h6 onClick={()=>setAuth('signup')}>Don't have an account?</h6>:
        <h6 onClick={()=>setAuth('signin')}>Already have an account?</h6>

    }
      <button onClick={()=>authenticate()} className="btn #ff4081 pink accent-2">{auth}</button>
    </div>
  );
}

export default Auth;
