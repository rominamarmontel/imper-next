import SignInBtns from '@/components/SignInBtns'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const SignIn = async () => {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }
  return <SignInBtns />
}

export default SignIn
