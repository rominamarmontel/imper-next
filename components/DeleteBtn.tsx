'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter()

  const deleteImage = async (publicId: string) => {
    const res = await fetch('api/removeImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure to delete this film?')

    if (confirmed) {
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
        })
        if (res.ok) {
          console.log('Post deleted')
          const post = await res.json()
          const { publicId } = post
          await deleteImage(publicId)

          toast.success('Film deleted successfully')
          router.refresh()
        }
      } catch (error) {
        toast.error('Something went wrong')
        console.log(error)
      }
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-500">
      Delete
    </button>
  )
}

export default DeleteButton
