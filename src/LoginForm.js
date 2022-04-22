import auth from "./firebase-config"
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         onAuthStateChanged,
         signOut
       } from "firebase/auth";
import Home from "./Home";
import { LogoutIcon } from "@heroicons/react/outline";
import SyncLoader from "react-spinners/SyncLoader";

function LoginForm(){
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)
  const [ isSigningUp, setIsSigningUp ] = useState(false)
  const [ loading, setLoading ] = useState(false)

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
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setIsLoggedIn(true)
      setLoading(false)
      console.log(userCredential)
    }
    catch(error){
      const errorMessage = error.message;
      setLoading(false)
      console.log(errorMessage)
    }
  }

  const signUp = async () => {
    try{
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setLoading(false)
      console.log(userCredential)
    }
    catch(error){
      const errorMessage = error.message;
      console.log(errorMessage)
      setLoading(false)
    }
  }

  const createUser = (state) => {
    setIsSigningUp(state)
  }

  const logout = async () => {
    try{
      setLoading(true)
      await signOut(auth)
      setEmail('')
      setPassword('')
      setIsLoggedIn(false)
      setLoading(false)

    }catch (error){
      const errorMessage = error.message;
      console.log(errorMessage)
      setIsLoggedIn(true)
      setLoading(false)
    }
  }

  const override = `
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100vh;
`;

  return (
    <div>
      {loading ? 
          <SyncLoader color={"#5C109E"} loading={loading} size={15} css={override} />
        :
        <>
        {isLoggedIn ?
          (
            <div className="bg-indigo-50">
              <button className="px-5 py-3 bg-indigo-800 font-medium text-white sm:px-10"
              onClick={logout} ><LogoutIcon className="h-5 w-5" /></button>
              <Home />
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
                  ):(
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
        </>
        }
    </div>
  )
}

export default LoginForm;