import "./style.css";
import auth from "./firebase-config"
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         onAuthStateChanged,
         signOut
       } from "firebase/auth";

function LoginForm(){
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setEmail(user.email);
        setIsLoggedIn(true);
        return;
      }
      setIsLoggedIn(false);
    });
  }, []);

  const login = async () => {
    try{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsLoggedIn(true)
      console.log(userCredential)
    }
    catch(error){
      const errorMessage = error.message;
      console.log(errorMessage)
    }
  }

  const signUp = async () => {
    try{
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential)
    }
    catch(error){
      const errorMessage = error.message;
      console.log(errorMessage)
    }
  }

  const logout = async () => {
    try{
      await signOut(auth)
      setEmail('')
      setPassword('')
      setIsLoggedIn(false)

    }catch (error){
      const errorMessage = error.message;
      console.log(errorMessage)
      setIsLoggedIn(true)
    }
  }

  return (
    <>
      {isLoggedIn ?
        (
          <div>
            <h1>Hello, {email}!</h1>
            <button className="btn-submit" onClick={logout} > Logout </button>
          </div> 
        )
      :
        ( 
          <div>
            <div className="form-label">
              <label>Username:</label>
              <input
                className="input-style"
                onChange={(event) => setEmail(event.target.value)}
                type="text"
                value={email}
               />
            </div>

            <div className="form-label">
              <label>Password:</label>
              <input
                className="input-style"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
               />
            </div>

            <div className="form-label">
              <button className="btn-submit" onClick={login} > Login </button>
              <button className="btn-submit" onClick={signUp} > SignUp </button>
            </div>

          </div>
        )
      }
    </>
  )
}

export default LoginForm;
