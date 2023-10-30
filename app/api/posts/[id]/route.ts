import prisma from "@/app/lib/prismadb"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export const GET = async (
  req: Request,
  {params}:{params: {id:string}}
  ) => {
    try {
      const id = params.id
      const post = await prisma.post.findUnique({where: {id}})
      return NextResponse.json(post)   
    } catch (error) {
      console.log(error)
      return NextResponse.json({message:"Could not fetch Id"})
    }
}

export const PUT = async (
  req: Request,
  {params}:{params: {id:string}}
  ) => {
    const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }
    const {
      title, 
      directedBy,
      links, 
      selectedCategory, 
      imageUrl, 
      publicId
    } = await req.json()
    const id = params.id
    try {
      const post = await prisma.post.update({
        where: {id}, 
        data: {title, directedBy, links, catName: selectedCategory, imageUrl, publicId}
    })
    return NextResponse.json(post)
    } catch (error) {
      console.log(error)
      return NextResponse.json({message: "Error editin post"})
    }
  }

export const DELETE = async (req: Request,
  {params}:{params: {id:string}}) => {
    const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({error: "Not authenticated"}, {status: 401})
  }
    const id = params.id
    try {
      const post = await prisma.post.delete({where:{id}})
      return NextResponse.json(post)
    } catch (error) {
      console.log(error)
      return NextResponse.json({message: "Error deleting the post"})
    }

}