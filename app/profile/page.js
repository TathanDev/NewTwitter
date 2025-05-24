import { verifySession } from "@/utils/dal"
import { PencilIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Image from "next/image"

export default async function Profile() {
    const session = await verifySession()
    if(!session) {
        return <div><h1>Vous devez etre connecté</h1></div>
    }

    let data = await fetch('http://localhost:3000//api/user/' + session.userId)
    let posts = await data.json()
  return (
    <form>
        <div className="flex flex-col text-center gap-y-4">
            <h1>Your Profile</h1>
            <h3>Customize your profile !</h3>

            <Image src={posts.pfp_user} width={20} height={20}/>
            <div className="flex flex-col text-center gap-y-2">
                <span><PencilIcon className="mx-auto size-4 text-gray-300"/> Write something Nice about yoj</span>
                <textarea 
                className="text-gray-950 block w-full rounded-md border-0 py-1.5shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                defaultValue={posts.description_user}
                rows={3}></textarea>
            </div>
        </div>


      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}