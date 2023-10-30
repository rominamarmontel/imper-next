import CategoriesList from '@/components/CategoriesList'
import Post from '@/components/Post'
import { TPost } from './types'

const getPosts = async (): Promise<TPost[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts`, {
      cache: 'no-store',
    })

    if (res.ok) {
      const posts = await res.json()
      return posts
    }
  } catch (error) {
    console.log(error)
  }
  return null
}

export default async function Home() {
  const posts = await getPosts()
  return (
    <>
      <div>
        <CategoriesList />
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              author={post.author.name}
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
          <div className="py-6 flex flex-col justify-center items-center border border-collapse mt-10">
            No films to display
          </div>
        )}
      </div>
    </>
  )
}
