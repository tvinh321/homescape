import { useState, useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import ReactPaginate from "react-paginate";

import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

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

export default function MyPost() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <div className="px-48 pt-10 pb-32 bg-white">
      <h1 className="font-bold text-3xl mt-4">Bài đăng của bạn</h1>
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
                      className="object-cover h-48 w-64 cursor-pointer"
                      src={house.image}
                      alt="Ảnh nhà đất"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/bai-dang/${house.id}`;
                      }}
                    />
                    <div className="ml-4 w-full relative">
                      <a href={`/bai-dang/${house.id}`}>
                        <div className="font-bold leading-relaxed mt-2 truncate text-lg transition-all duration-200 hover:text-blue-700">
                          {house.title}
                        </div>
                      </a>
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
                        <div className="flex mr-4">
                          <a href={`/chinh-sua/${house.id}`}>
                            <PencilIcon className="h-5 w-5 mr-2 text-gray-700 hover:text-blue-700" />
                          </a>
                          <TrashIcon
                            className="h-5 w-5 text-gray-700 hover:text-red-700 cursor-pointer"
                            onClick={() => {}}
                          />
                        </div>
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
