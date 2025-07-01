import { verifySession } from "@/utils/dal";
import { redirect } from "next/navigation";
import UnifiedProfile from "../components/unifiedProfile";

export default async function ProfilePage() {
  const session = await verifySession();
  if (!session) {
    return (
      <div>
        <h1>Vous devez etre connecté</h1>
      </div>
    );
  }
  let data = await fetch("http://localhost:3000/api/user/" + session.userId);
  let user = await data.json();
  redirect("profile/" + session.userId);
}
