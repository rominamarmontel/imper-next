import Image from 'next/image'
import React from 'react'
import styles from './styles.module.css'
import Link from 'next/link'
import DeleteBtn from './DeleteBtn'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface PostProps {
  id: string
  date: string
  thumbnail: string
  links?: string[]
  title: string
  directedBy?: string
  category: string
  author: string
  authorEmail: string
}
const Post = async ({
  id,
  author,
  date,
  thumbnail,
  authorEmail,
  title,
  directedBy,
  links,
  category,
}: PostProps) => {
  const session = await getServerSession(authOptions)

  const isEditable = session && session?.user?.email === authorEmail

  const dateObject = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const formattedDate = dateObject.toLocaleDateString('fr-FR', options)

  return (
    <div className="my-4 border-b border-b-300 py-8">
      <div className="flex justify-end items-center">
        {author && <p className={styles.PostDate}>posted @ {formattedDate}</p>}
      </div>

      <div className="w-full h-72 relative">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        ) : null}
      </div>

      {category && (
        <Link href={`categories/${category}`} className={styles.PostCategories}>
          {category}
        </Link>
      )}

      <h2 className={styles.PostTitle}>{title}</h2>
      <p className={styles.PostDirectedBy}>
        <span>de </span>
        {directedBy}
      </p>

      {links && (
        <div>
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              {/* <Link className={`link ${styles.PostLink}`} href={link}> */}
              <Link className="link" href={link}>
                {link}
              </Link>
            </div>
          ))}
        </div>
      )}

      {isEditable && (
        <div className="flex gap-3 border  border-black font-bold py-2 px-4 w-fit mt-5">
          <Link href={`/edit-post/${id}`}>Edit</Link>
          <DeleteBtn id={id} />
        </div>
      )}
    </div>
  )
}

export default Post
