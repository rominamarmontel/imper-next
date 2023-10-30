import { NextResponse } from "next/server"
import prisma from "@/app/lib/prismadb"

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.log(error)
    return NextResponse.json("Something went wrong.")
  }
}
