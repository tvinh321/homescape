import Header from "../components/Header";
import Footer from "../components/Footer";

import SearchOption from "../components/Search/SearchOption";
import SearchResults from "../components/Search/SearchResults";

export default function Search() {
  return (
    <>
      <Header />
      <div>
        <SearchOption />
        <SearchResults />
      </div>
      <Footer />
    </>
  );
}
