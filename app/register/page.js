import { SignupForm } from "@/app/components/registerForm.jsx";
import { verifySession } from "@/utils/dal";

export default async function Page() {
  const session = await verifySession();
  if (session) {
    console.log(session.userId);
    return <div>vous êtes déja connecté</div>;
  }

  return (
    <div>
      <SignupForm />
    </div>
  );
}
