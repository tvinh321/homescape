import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import ReactPaginate from "react-paginate";

import { TrashIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

import axios, { baseURL } from "../../axiosConfig";

import { CSSTransition } from "react-transition-group";

export default function MyPost() {
  const searchParams = new URLSearchParams(window.location.search);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [properties, setProperties] = useState([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      window.location.href = "/dang-nhap";
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/user/myProperties?page=${page}`, {
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

  const handleDelete = (e, id) => {
    e.preventDefault();
    axios
      .delete(`/api/user/property/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setProperties(properties.filter((property) => property.id !== id));
        setDeleteModal(false);
      })
      .catch((err) => {
        alert("Xóa bài đăng thất bại");
      });
  };

  return (
    <>
      <div className="px-48 pt-10 pb-32 bg-white">
        <h1 className="font-bold text-2xl mt-4">Bài đăng của bạn</h1>
        <div className="mx-auto mt-8 flex flex-col">
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
                        className="object-cover h-48 w-64 cursor-pointer"
                        src={baseURL + "/api/property/file/" + house.image}
                        alt="Ảnh nhà đất"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/bai-dang/${house.id}`;
                        }}
                      />
                      <div className="ml-4 w-full relative">
                        <a href={`/bai-dang/${house.id}`}>
                          <div className="font-bold mt-2 line-clamp-1 mr-4 transition-all duration-200 hover:text-blue-700 w-full">
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
                              onClick={(e) => {
                                e.preventDefault();
                                setDeleteModal(true);
                                setDeleteId(house.id);
                              }}
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
      {deleteModal && (
        <>
          {deleteModal && (
            <div className="fixed inset-0 z-50">
              <div className="flex items-end justify-center min-h-screen pt-8 px-8 pb-32 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
              </div>
            </div>
          )}
          <CSSTransition
            in={deleteModal}
            timeout={300}
            classNames="modal-transition"
            unmountOnExit
          >
            <div className="fixed inset-0 z-50">
              <div className="flex items-center justify-center min-h-screen pt-8 px-8 pb-32 text-center sm:p-0">
                <div
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <XMarkIcon
                          className="h-6 w-6 text-blue-700"
                          aria-hidden="true"
                          width="20"
                          height="20"
                        />
                      </div>
                      <div className="mt-3  sm:mt-0 sm:ml-4 text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          Xóa bài đăng
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Bạn có chắc chắn muốn xóa bài
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex items-end justify-end">
                    <button
                      onClick={() => setDeleteModal(false)}
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 border-blue-600 text-base font-medium text-neutral-700 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={(e) => {
                        handleDelete(e, deleteId);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CSSTransition>
        </>
      )}
    </>
  );
}
