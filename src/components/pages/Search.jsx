import SearchResults from "@/components/organisms/SearchResults";

const Search = ({ currentUser }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <SearchResults currentUser={currentUser} />
    </div>
  );
};

export default Search;