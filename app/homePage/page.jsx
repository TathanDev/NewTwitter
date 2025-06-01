import HomePage from "../components/homePage";
import SearchBar from "../components/searchBar";

export default function GetHomePage() {
  return (
    <div className="fixed bottom-4 left-4 right-4">
      <SearchBar></SearchBar>
    </div>
  );
}
