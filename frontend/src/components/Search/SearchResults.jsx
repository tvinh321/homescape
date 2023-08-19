import { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import { AuthContext } from "../../contexts/AuthContext";

import ReactPaginate from "react-paginate";

import { HeartIcon } from "@heroicons/react/24/outline";

const mockData = [
  {
    id: 1,
    title: "Bán nhà mặt tiền đường Nguyễn Văn Cừ, Quận 5",
    price: 1000000000,
    area: 100,
    location: "Quận 5, TP. Hồ Chí Minh",
    image: "https://picsum.photos/1920/1080",
    favorite: true,
  },
  {
    id: 2,
    title: "Bán nhà mặt tiền đường Nguyễn Văn Cừ, Quận 5",
    price: 1000000000,
    area: 100,
    location: "Quận 5, TP. Hồ Chí Minh",
    image: "https://picsum.photos/1920/1080",
    favorite: false,
  },
  {
    id: 3,
    title: "Bán nhà mặt tiền đường Nguyễn Văn Cừ, Quận 5",
    price: 1000000000,
    area: 100,
    location: "Quận 5, TP. Hồ Chí Minh",
    image: "https://picsum.photos/1920/1080",
    favorite: true,
  },
];

export default function SearchResults() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [searchResults, setSearchResults] = useState(mockData);
  const [sortedResults, setSortedResults] = useState(mockData);
  const [itemList] = useState([]);
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "priority"
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
    const verified = searchParams.get("verified");
    const paging = searchParams.get("page");
    const sort = sortOption;

    let postForm = {
      title: title,
      price: price,
      area: area,
      type: type,
      bedroom: bedroom,
      verified: verified,
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
      .post(`/api/properties${paging ? "?page=" + paging : ""}`, postForm, {
        headers: user?.token && { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setSearchResults(response.data.properties?.data);
        setSortedResults(response.data.properties?.data);

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
            <option value="priority">Mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="area-asc">Diện tích tăng dần</option>
            <option value="area-desc">Diện tích giảm dần</option>
          </select>
        </div>
      </div>
      <div className="mx-auto mt-8">
        {loading ? (
          <div className="col-span-3 flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {sortedResults.map((house, index) => {
              return (
                <a href={`/thong-tin/${house.id}`} key={index}>
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
                        {house.area} m<sup>2</sup>
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
