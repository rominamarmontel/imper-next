'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TCategory, TPost } from '@/app/types'
import { useRouter } from 'next/navigation'
import { CldUploadButton, CldUploadWidgetResults } from 'next-cloudinary'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

const EditPostForm = ({ post }: { post: TPost }) => {
  const [links, setLinks] = useState<string[]>([])
  const [linkInput, setLinkInput] = useState('')
  const [title, setTitle] = useState('')
  const [directedBy, setDirectedBy] = useState('')
  const [categories, setCategories] = useState<TCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [publicId, setPublicId] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await fetch('/api/categories')
      const catNames = await res.json()
      setCategories(catNames)
    }
    fetchAllCategories()
    const initValues = () => {
      setTitle(post.title)
      setDirectedBy(post.directedBy)
      setImageUrl(post.imageUrl || '')
      setPublicId(post.publicId || '')
      setSelectedCategory(post.catName || '')
      setLinks(post.links || [])
    }
    initValues()
  }, [
    post.title,
    post.directedBy,
    post.imageUrl,
    post.publicId,
    post.catName,
    post.links,
  ])

  const handleImageUpload = async (result: CldUploadWidgetResults) => {
    const info = result.info as object
    if ('secure_url' in info && 'public_id' in info) {
      const url = info.secure_url as string
      const public_id = info.public_id as string
      setImageUrl(url)
      setPublicId(public_id)
    }
  }

  const addLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (linkInput.trim() !== '') {
      setLinks((prev) => [...prev, linkInput])
      setLinkInput('')
    }
  }

  const deleteLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index))
  }

  async function removeImage(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/removeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })
      if (res.ok) {
        setImageUrl('')
        setPublicId('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !selectedCategory) {
      toast.error('Title and category are required')
      return
    }
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          title,
          directedBy,
          links,
          selectedCategory,
          imageUrl,
          publicId,
        }),
      })

      if (res.ok) {
        toast.success('Update film successfully')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Edit Film</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 rounded-md border appearance-none"
          value={selectedCategory}
        >
          <option value="-1">Sélectionnez une catégorie</option>
          {categories &&
            categories.map((category) => (
              <option key={category.id} value={category.catName}>
                {category.catName}
              </option>
            ))}
        </select>

        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          value={title}
        />

        <textarea
          onChange={(e) => setDirectedBy(e.target.value)}
          placeholder="Réalisé par"
          value={directedBy}
        />

        {links &&
          links.map((link, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                </svg>
              </span>
              <Link href={link} className="link">
                {link}
              </Link>
              <span className="cursor-pointer" onClick={() => deleteLink(i)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </span>
            </div>
          ))}
        <div className="flex gap-2">
          <input
            type="text"
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="Pasete the link and click on Add"
            className="flex-1"
            value={linkInput}
          />
          <button onClick={addLink} className="btn flex gap-2 items-center">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
              </svg>
            </span>
            Add
          </button>
        </div>

        <div className="relative">
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onUpload={handleImageUpload}
            className={`h-48 w-full border-2 mt-4 border-dotted grid place-items-center bg-slate-100 ${
              imageUrl && 'pointer-events-none'
            }`}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
          </CldUploadButton>
          {imageUrl && (
            <Image
              src={imageUrl}
              fill
              className="absolute object-cover inset-0"
              alt={title}
            />
          )}
          {publicId && (
            <span
              onClick={removeImage}
              className="m-1 w-7 h-7 absolute top-0 right-0 text-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          )}
        </div>

        <button className="primary-btn">Update Film</button>
      </form>
    </div>
  )
}

export default EditPostForm
