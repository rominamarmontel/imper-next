import Post from '@/components/Post'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { TPost } from '../types'

const getPosts = async (email: string) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authors/${email}`)
    const { posts } = await res.json()
    return posts
  } catch (error) {
    return null
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  let posts = []
  if (!session) {
    redirect('/sign-in')
  } //サインインしていないとdashboardページに行けない

  if (email) {
    posts = await getPosts(email)
  }

  return (
    <div>
      <h1>Dashboard === Admin Page</h1>
      {posts && posts.length > 0 ? (
        posts.map((post: TPost) => (
          <Post
            key={post.id}
            id={post.id}
            author={''}
            authorEmail={post.authorEmail}
            date={post.createdAt}
            category={post.catName}
            title={post.title}
            directedBy={post.directedBy}
            thumbnail={post.imageUrl}
            links={post.links || []}
          />
        ))
      ) : (
        <div style={{ padding: 24, display: 'flex', gap: 3 }}>
          No films created yet.
          <Link style={{}} href={`/create-post`}>
            Create New Film
          </Link>
        </div>
      )}
    </div>
  )
}
