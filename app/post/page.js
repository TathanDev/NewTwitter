import { verifySession } from "@/utils/dal";
import Post from "../components/post";
import { createApiUrl } from "@/utils/url";

export default async function ProfilePage() {
  const session = await verifySession();
  if (!session) {
    return (
      <div>
        <h1>Vous devez etre connecté</h1>
      </div>
    );
  }
  let data = await fetch(createApiUrl(`/api/user/${session.userId}`));
  let user = await data.json();
  return <Post user={user} />;
}
