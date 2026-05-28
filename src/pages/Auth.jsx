import React, {
  useState,
} from 'react';

import { supabase }
from '../supabase/client';

import {
  Shield,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

const Auth = () => {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isLogin, setIsLogin] =
    useState(true);

  /* ---------------- LOGIN / SIGNUP ---------------- */

  const handleAuth =
    async () => {

      if (
        !email ||
        !password
      ) {

        alert(
          'Please fill all fields'
        );

        return;
      }

      setLoading(true);

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
            '/home';
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

      setLoading(false);
    };

  /* ---------------- FORGOT PASSWORD ---------------- */

  const handleForgotPassword =
    async () => {

      if (!email) {

        alert(
          'Enter your email first'
        );

        return;
      }

      const { error } =
        await supabase.auth.resetPasswordForEmail(

          email,

          {
            redirectTo:
              window.location.origin +
              '/auth',
          }
        );

      if (error) {

        alert(error.message);

      } else {

        alert(
          'Password reset email sent!'
        );
      }
    };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-5 relative overflow-hidden">

      {/* RED GLOW */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-red-500/20 blur-[140px]" />

      {/* CYAN GLOW */}

      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px]" />

      {/* CARD */}

      <div className="
        relative
        z-10
        bg-zinc-900/90
        backdrop-blur-2xl
        border
        border-white/10
        p-8
        rounded-[32px]
        w-full
        max-w-md
        shadow-[0_0_60px_rgba(255,255,255,0.03)]
      ">

        {/* LOGO */}

        <div className="flex justify-center mb-5">

          <div className="
            w-20
            h-20
            rounded-full
            bg-gradient-to-br
            from-red-500
            to-red-700
            flex
            items-center
            justify-center
            shadow-[0_0_40px_rgba(239,68,68,0.4)]
          ">

            <Shield className="w-10 h-10 text-white" />

          </div>

        </div>

        {/* TITLE */}

        <h1 className="text-4xl font-black text-white text-center">

          {isLogin
            ? 'Welcome Back'
            : 'Create Account'}

        </h1>

        <p className="text-center text-gray-400 mt-3 mb-8">

          {isLogin
            ? 'Login to continue using Rakshak AI'
            : 'Join Rakshak AI emergency protection'}

        </p>

        {/* EMAIL */}

        <div className="relative mb-5">

          <Mail className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            w-5
            h-5
          " />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="
              w-full
              bg-zinc-800/80
              text-white
              pl-12
              pr-4
              py-4
              rounded-2xl
              outline-none
              border
              border-white/5
              focus:border-red-500/40
            "
          />

        </div>

        {/* PASSWORD */}

        <div className="relative mb-3">

          <Lock className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            w-5
            h-5
          " />

          <input
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              bg-zinc-800/80
              text-white
              pl-12
              pr-14
              py-4
              rounded-2xl
              outline-none
              border
              border-white/5
              focus:border-red-500/40
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          >

            {showPassword
              ? (
                <EyeOff className="w-5 h-5" />
              )
              : (
                <Eye className="w-5 h-5" />
              )}

          </button>

        </div>

        {/* FORGOT PASSWORD */}

        {isLogin && (

          <button
            onClick={
              handleForgotPassword
            }
            className="
              flex
              items-center
              gap-2
              text-sm
              text-gray-400
              hover:text-red-400
              transition
              mb-6
            "
          >

            <KeyRound className="w-4 h-4" />

            Forgot Password?

          </button>
        )}

        {/* LOGIN BUTTON */}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="
            w-full
            bg-gradient-to-r
            from-green-400
            to-green-500
            py-4
            rounded-2xl
            text-black
            font-black
            text-lg
            flex
            items-center
            justify-center
            gap-3
            hover:scale-[1.02]
            transition
          "
        >

          {loading
            ? 'Please wait...'
            : isLogin
            ? (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )
            : (
              <>
                <UserPlus className="w-5 h-5" />
                Signup
              </>
            )}

        </button>

        {/* SWITCH */}

        <p
          className="
            text-center
            text-gray-400
            mt-7
            cursor-pointer
            hover:text-white
            transition
          "
          onClick={() =>
            setIsLogin(
              !isLogin
            )
          }
        >

          {isLogin
            ? 'Create Account'
            : 'Already have an account?'}

        </p>

      </div>

    </div>
  );
};

export default Auth;