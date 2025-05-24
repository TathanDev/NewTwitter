import Image from 'next/image'

export function MemeComponent(memeData, key) {
    let meme = memeData.memeData
    return (
        <div key={key}>
            <a href={`/meme/${meme.meme_id}`}>
                <div className="flex-row bg-slate-800 rounded-lg size-60">
                        <Image
                            src={meme.meme_url}
                            alt={meme.meme_title}
                            width={175}
                            height={200}
                            className='place-self-center py-1 rounded-lg'
                        />
                        <h1 className='text-center self-end'>{meme.meme_title}</h1>
                </div>
            </a>
        </div>
    )
}
  