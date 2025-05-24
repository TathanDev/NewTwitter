import Meme from "@/entities/Meme"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    const slug = (await params).number // 'a', 'b', or 'c'

    let memes = []
    for (let i = 0; i <= slug; i++) {
        let meme = await Meme.findOne({ where: {meme_id: i}})
        if (meme) {
            memes.push(meme)
        }
    }
    return NextResponse.json({ memes: memes })


}
