import Post from "../components/post";
import SearchBar from "../components/searchBar";

export default function GetHomePage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Post />
        <Post />
      </div>

      <div className="fixed bottom-0 left-4 right-4">
        <SearchBar></SearchBar>
      </div>
    </div>
  );
}
