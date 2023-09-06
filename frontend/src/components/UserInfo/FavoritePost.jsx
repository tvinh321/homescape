import { useState, useContext } from "react";

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

export default function FavoritePost() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <div className="px-48 pt-10 pb-32 bg-white">
      <h1 className="font-bold text-3xl mt-4">Bài đăng yêu thích</h1>
      <div className="mx-auto mt-8">
        {loading ? (
          <div className="col-span-3 flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {mockData.map((house, index) => {
              return (
                <>
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
                        <p className="text-gray-700 text-sm">
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
                </>
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
