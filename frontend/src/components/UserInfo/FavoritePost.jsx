import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import ReactPaginate from "react-paginate";

import { HeartIcon } from "@heroicons/react/24/outline";
import axios, { baseURL } from "../../axiosConfig";

export default function FavoritePost() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!user) {
      window.location.href = "/dang-nhap";
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/user/myFavorites?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setTotalPage(res.data.data.totalPages);
        setProperties(res.data.data.properties);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  const handleFavorite = (e, id) => {
    e.preventDefault();
    const favorite = properties.find((property) => property.id === id).favorite;
    if (favorite) {
      setProperties(
        properties.map((property) => {
          if (property.id === id) {
            return { ...property, favorite: false };
          }
          return property;
        })
      );
      axios
        .delete(`/api/user/favorite/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setProperties(
        properties.map((property) => {
          if (property.id === id) {
            return { ...property, favorite: true };
          }
          return property;
        })
      );
      axios
        .get(`/api/user/favorite/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="px-48 pt-10 pb-32 bg-white">
      <h1 className="font-bold text-2xl mt-4">Bài đăng yêu thích</h1>
      <div className="mx-auto mt-8">
        {loading ? (
          <div className="col-span-3 flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {properties.map((house, index) => {
              return (
                <>
                  <div className="flex border w-full hover:shadow-xl transition-all duration-200">
                    <img
                      className="object-cover h-48 w-64 min-w-[16rem] cursor-pointer"
                      src={baseURL + "/api/property/file/" + house.image}
                      alt="Ảnh nhà đất"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/bai-dang/${house.id}`;
                      }}
                    />
                    <div className="ml-4 w-full relative">
                      <a href={`/bai-dang/${house.id}`}>
                        <div className="font-bold mt-2 line-clamp-1 transition-all duration-200 hover:text-blue-700 mr-4">
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
                        <button className={"text-sm mr-3"}>
                          <HeartIcon
                            className={
                              "h-5 w-5" +
                              (house.favorite
                                ? " fill-current text-red-600"
                                : " text-gray-400")
                            }
                            onClick={(e) => {
                              handleFavorite(e, house.id);
                            }}
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
