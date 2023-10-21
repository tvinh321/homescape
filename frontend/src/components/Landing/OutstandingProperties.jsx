import React, { useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";

import axios, { baseURL } from "../../axiosConfig";

export default function OutstandingProperties() {
  const [houseList, setHouseList] = React.useState([]);

  useEffect(() => {
    const fetchHouseList = async () => {
      const res = await axios.get("/api/property/outstanding");
      setHouseList(res.data.data);
    };
    fetchHouseList();
  }, []);

  return (
    <div className="w-full px-48 pt-10 pb-20 bg-white">
      <h1 className="font-bold text-3xl mt-4">Bất động sản</h1>
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8">
          {houseList ? (
            houseList.map((house, index) => {
              return (
                <a href={`/bai-dang/${house.id}`} key={index}>
                  <div className="rounded-lg shadow-sm hover:shadow-xl transition-all duration-150 border border-gray-300 relative h-96 bg-white">
                    <div className="h-48">
                      <img
                        className="object-cover h-full w-full rounded-t-lg"
                        src={baseURL + `/api/property/file/${house.image}`}
                        alt="Ảnh nhà đất"
                      />
                    </div>
                    <div className="px-6 py-4 h-48 flex flex-col justify-between">
                      <div>
                        <div className="font-bold leading-relaxed mt-2 truncate">
                          {house.title}
                        </div>
                        <p className="text-gray-700 text-sm">
                          {(house.price / 1000000000).toFixed(1)} tỷ -{" "}
                          {house.area?.toFixed(1)} m<sup>2</sup>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-700 text-sm">
                          {house.location}
                        </p>
                        <button className="text-sm">
                          <HeartIcon
                            className={
                              "w-5 h-5 " +
                              (house.favorite
                                ? "text-red-600 fill-current"
                                : "text-gray-400")
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            // Loading Spinner
            <div className="col-span-3 flex justify-center flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t border-gray-900"></div>
              <p className="mt-8">Đang tải</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center items-center mt-10">
        <a href="/tim-kiem">
          <button className="text-gray-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-600 hover:text-white hover:border-white transition-all duration-150 border border-gray-600">
            Xem thêm
          </button>
        </a>
      </div>
    </div>
  );
}
