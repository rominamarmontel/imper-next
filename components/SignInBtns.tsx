'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'

const SignInBtns = () => {
  return (
    <>
      <h1>Sign In</h1>
      <div className="mt-4 p-4 flex flex-col justify-center items-center gap-4">
        <button
          onClick={() => signIn('google')}
          className="flex items-center border p-4 rounded-full gap-4 hover:bg-slate-100/25 transition"
        >
          <span>
            <Image
              src={'https://madeby.google.com/static/images/google_g_logo.svg'}
              width={30}
              height={30}
              alt="google logo"
            />
          </span>
          Sign in with google
        </button>
      </div>
    </>
  )
}

export default SignInBtns
