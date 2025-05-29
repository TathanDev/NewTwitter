import { verifySession } from "@/utils/dal";
import UserSettings from "../components/userSettings";

export default async function Settings() {
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
  return <UserSettings user={user} />;
}
