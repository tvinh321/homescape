import { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";

import ReactPaginate from "react-paginate";

import { HeartIcon } from "@heroicons/react/24/outline";

import { sortOptions } from "../../constants/properties";

export default function SearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [searchResults, setSearchResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [itemList] = useState([]);
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "popular"
  );
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResult, setTotalResult] = useState(0);

  useEffect(() => {
    console.log(page);
    setLoading(true);
    const title = searchParams.get("title");
    const ward = searchParams.get("ward");
    const district = searchParams.get("district");
    const city = searchParams.get("city");
    const price = searchParams.get("price")
      ? searchParams.get("price").split("-")
      : null;
    const area = searchParams.get("area")
      ? searchParams.get("area").split("-")
      : null;
    const type = searchParams.get("type")
      ? searchParams.get("type").split(",")
      : null;
    const bedroom = searchParams.get("bedroom");
    const paging = searchParams.get("page");
    const sort = sortOption;

    let postForm = {
      title: title,
      price: price,
      area: area,
      type: type,
      bedroom: bedroom,
      sort: sort,
    };

    if (ward) {
      postForm.ward = ward;
    } else if (district) {
      postForm.district = district;
    } else if (city) {
      postForm.city = city;
    }

    axios
      .post(
        `/api/property/query${paging ? "?page=" + paging : "?page=1"}`,
        postForm,
        {
          headers: user?.token && { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((response) => {
        setSearchResults(response.data?.data);
        setSortedResults(response.data?.data);

        setTotalResult(response.data.properties?.total);
        setTotalPage(response.data.properties?.last_page);

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [page, sortOption]);

  return (
    <div className="w-4/5 px-48 pt-10 pb-32 bg-white">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl mt-4">Kết quả tìm kiếm</h1>
        <div className="flex items-center">
          <p className="text-gray-700 text-sm mr-2">Sắp xếp theo</p>
          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
          >
            {sortOptions.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="mx-auto mt-8">
        {loading ? (
          <div className="col-span-3 flex justify-center flex-col items-center mt-24 mb-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t border-gray-900"></div>
            <p className="mt-8">Đang tải</p>
          </div>
        ) : (
          <>
            {sortedResults.map((house, index) => {
              return (
                <a href={`/bai-dang/${house.id}`} key={index}>
                  <div className="flex border w-full hover:shadow-xl transition-all duration-200">
                    <img
                      className="object-cover h-48 w-64"
                      src={house.image}
                      alt="Ảnh nhà đất"
                    />
                    <div className="ml-4 w-full relative">
                      <div className="font-bold leading-relaxed mt-2 truncate text-lg">
                        {house.title}
                      </div>
                      <p className="text-gray-700 text-sm">
                        {house.area?.toFixed(1)} m<sup>2</sup>
                      </p>
                      <p className="text-red-600 font-semibold">
                        {(house.price / 1000000000).toFixed(1)} tỷ
                      </p>
                      <div className="flex justify-between bottom-0 absolute w-full mb-4">
                        <p className="mt-4 text-gray-700 text-sm">
                          {house.location}
                        </p>
                        <button
                          className={"text-sm mr-3"}
                          onClick={(e) => {
                            e.preventDefault();
                            if (user) {
                              axios
                                .post(
                                  `/api/properties/${house.id}/save`,
                                  {},
                                  {
                                    headers: {
                                      Authorization: `Bearer ${user.token}`,
                                    },
                                  }
                                )
                                .then((response) => {
                                  console.log(response);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }
                          }}
                        >
                          <HeartIcon
                            className={
                              "h-5 w-5" +
                              (house.favorite
                                ? " fill-current text-red-600"
                                : " text-gray-400")
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={totalPage}
          onPageChange={(e) => {
            // Find ?page= in url
            const urlParams = new URLSearchParams(window.location.search);
            // Set ?page= in url
            urlParams.set("page", e.selected + 1);
            // Set url with ?page= in url
            window.history.pushState(
              {},
              "",
              window.location.pathname + "?" + urlParams.toString()
            );
            setPage(e.selected + 1);
          }}
          containerClassName={"flex items-center justify-center mt-10"}
          pageClassName={"mx-2"}
          activeClassName={"text-white bg-blue-600 rounded-lg px-2 py-1"}
          previousClassName={"mx-2"}
          nextClassName={"mx-2"}
          disabledClassName={"text-gray-300"}
          forcePage={page - 1}
        />
      </div>
    </div>
  );
}
