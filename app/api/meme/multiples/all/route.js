import Meme from "@/entities/Meme"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    const memes = await Meme.findAll();
    return NextResponse.json({ memes: memes })
}
