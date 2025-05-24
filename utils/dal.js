import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/utils/session'
import {cache} from 'react';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  
  if (!session) {
    return null
  }
 
  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    try {
      const user = await Project.findByPk(session.userId);
   
      return user
    } catch (error) {
      console.log('Failed to fetch user')
      return null
    }
  })