import Meme from "@/entities/Meme"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    const slug = (await params).id // 'a', 'b', or 'c'

    let meme = await Meme.findOne({ where: {meme_id: slug}})
    if(meme == null) {
        meme = await Meme.findOne({ where: {meme_title: slug}})
        if(meme == null) {
            return NextResponse.json({ error: 'Meme not found' })
        }
    }
    return NextResponse.json(meme)

}
