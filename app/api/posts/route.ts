import { NextResponse } from "next/server"
import prisma from "@/app/lib/prismadb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (req: Request) =>{
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }
  
  const {title, directedBy, links, selectedCategory, imageUrl, publicId} = await req.json()

  const authorEmail = session?.user?.email as string

  if (!title || !selectedCategory) {
    return NextResponse.json(
      {error: "Title and Category are required"},
      {status: 500}
    )
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        directedBy,
        links,
        imageUrl,
        publicId,
        catName: selectedCategory,
        authorEmail,
      }
    })
    console.log("Post created")
    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json({message: "Could not create post"})
  }
}

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {author: {select: { name: true}}},
      orderBy: {
        createdAt: 'desc',
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      {message: "Some error occured"}, 
      {status: 500}
      )
  }
}