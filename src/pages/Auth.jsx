import React, {
  useState,
} from 'react';

import { supabase }
from '../supabase/client';

const Auth = () => {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isLogin, setIsLogin] =
    useState(true);

  const handleAuth =
    async () => {

      if (isLogin) {

        const { error } =
          await supabase.auth.signInWithPassword({

            email,
            password,
          });

        if (error) {

          alert(error.message);

        } else {

          alert(
            'Login Successful'
          );

          window.location.href =
            '/';
        }

      } else {

        const { error } =
          await supabase.auth.signUp({

            email,
            password,
          });

        if (error) {

          alert(error.message);

        } else {

          alert(
            'Signup Successful'
          );

          setIsLogin(true);
        }
      }
    };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      <div className="bg-zinc-900 p-8 rounded-3xl w-full max-w-md">

        <h1 className="text-4xl font-black text-white mb-8 text-center">

          {isLogin
            ? 'Login'
            : 'Signup'}

        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-800
            text-white
            px-4
            py-4
            rounded-2xl
            mb-5
            outline-none
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            w-full
            bg-zinc-800
            text-white
            px-4
            py-4
            rounded-2xl
            mb-5
            outline-none
          "
        />

        <button
          onClick={handleAuth}
          className="
            w-full
            bg-green-500
            py-4
            rounded-2xl
            text-black
            font-bold
          "
        >

          {isLogin
            ? 'Login'
            : 'Signup'}

        </button>

        <p
          className="
            text-center
            text-gray-400
            mt-5
            cursor-pointer
          "
          onClick={() =>
            setIsLogin(
              !isLogin
            )
          }
        >

          {isLogin
            ? 'Create Account'
            : 'Already have account?'}

        </p>

      </div>

    </div>
  );
};

export default Auth;