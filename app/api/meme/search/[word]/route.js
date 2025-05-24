import Meme from "@/entities/Meme"
import { NextResponse } from "next/server"
const { Op } = require('sequelize');

export async function GET(request, { params }) {
    const word = (await params).word // 'a', 'b', or 'c'

    console.log(word)

    const memes = await Meme.findAll({
        where: {
            meme_keywords: {
              [Op.substring]: word
            }
          }
    });
  
    return NextResponse.json({ memes: memes })
}
