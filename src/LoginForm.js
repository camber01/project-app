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
  const [ isSigningUp, setIsSigningUp ] = useState(false)

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

  const createUser = (state) => {
    setIsSigningUp(state)
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
    <div>
      {isLoggedIn ?
        (
          <div>
            <h1>Hello, {email}!</h1>
            <button className="btn-submit" onClick={logout} > Logout </button>
          </div> 
        )
      :
        ( 
          <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <p className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to Hotel Hanap!</p>
              <div>
                {isSigningUp ?
                (
                  <h2 className="my-5">Create your account:</h2>
                ):(
                  null
                )}
                <input
                  className="appearance-none rounded-none relative block
                    w-full px-3 py-2 border border-gray-300
                    placeholder-gray-500 text-gray-900 rounded-t-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm"
                  onChange={(event) => setEmail(event.target.value)}
                  type="text"
                  value={email}
                  placeholder="Email Address"
                />
              </div>

              <div>
                <input
                  className="appearance-none rounded-none relative block
                    w-full px-3 py-2 border border-gray-300
                    placeholder-gray-500 text-gray-900 rounded-b-md
                    focus:outline-none focus:ring-indigo-500
                    focus:border-indigo-500 focus:z-10 sm:text-sm"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  value={password}
                  placeholder="Password"
                />
              </div>

              { isSigningUp ?
                (
                  <>
                    <div>
                      <button
                        className="group relative w-full flex justify-center
                          py-2 px-4 border border-transparent text-sm font-medium
                          rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          focus:ring-indigo-500 "
                        onClick={signUp}>
                        Sign Up
                      </button>
                    </div>
                    <p className="pt-5 text-center text-gray-500">Already have an account? Click <button className="underline" onClick={() => createUser(false)}>here</button> to sign in.</p>
                  </>
                )
                :
                (
                  <>
                    <div>
                      <button
                        className="group relative w-full flex justify-center
                          py-2 px-4 border border-transparent text-sm font-medium
                          rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          focus:ring-indigo-500"
                        onClick={login}>
                        Sign In
                      </button>
                    </div>
                    <p className="pt-5 text-center text-gray-500">Don't have an account? Click <button className="underline" onClick={() => createUser(true)}>here</button> to sign up.</p>
                  </>
                )
              }

            </div>
          </div>
        )
      }
    </div>
  )
}

export default LoginForm;