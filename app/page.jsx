import GetHomePage from "./homePage/page";
import GetLobby from "./lobby/page";
import { verifySession } from "@/utils/dal";

export default async function Page() {
  const isLoggedIn = await verifySession();
  
  // Si l'utilisateur n'est pas connecté, afficher directement le lobby
  if (!isLoggedIn) {
    return (
      <main className="p-6">
        <GetLobby />
      </main>
    );
  }

  // Si l'utilisateur est connecté, récupérer ses données
  let data = await fetch("http://localhost:3000/api/user/" + isLoggedIn.userId);
  let user = await data.json();

  let dataPosts = await fetch("http://localhost:3000/api/getPosts");
  let postsList = await dataPosts.json();

  return (
    <main className="p-6">
      <GetHomePage postsList={postsList} user={user} />
    </main>
  );
}
