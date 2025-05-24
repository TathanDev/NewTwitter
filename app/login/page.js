import { LoginForm } from '@/app/components/login';
import { verifySession } from '@/utils/dal';

export default async function Page() {

    const session = await verifySession()
    if(session) {
        return <div>vous êtes déja connecté</div>
    }

    return (
        <div>
            
        <LoginForm />
        </div>
    )
}