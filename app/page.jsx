import GetHomePage from "./homePage/page";
import GetLobby from "./lobby/page";
import { verifySession } from "@/utils/dal";

export default async function Page() {
  const isLoggedIn = await verifySession(); // Fonction exécutée côté serveur

  return (
    <main className="p-6">{isLoggedIn ? <GetHomePage /> : <GetLobby />}</main>
  );
}
