import { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { CSSTransition } from "react-transition-group";

import {
  typesList,
  directionsList,
  bedroomList,
} from "../../constants/properties";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

export default function Search() {
  const searchParams = new URLSearchParams(window.location.search);

  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  const [title, setTitle] = useState(searchParams.get("title"));
  const [ward, setWard] = useState(searchParams.get("ward"));
  const [district, setDistrict] = useState(searchParams.get("district"));
  const [city, setCity] = useState(searchParams.get("city"));
  const [cities, setCities] = useState(
    searchParams.get("cities")?.split(",") || []
  );
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [minArea, setMinArea] = useState();
  const [maxArea, setMaxArea] = useState();
  const [type, setType] = useState(
    searchParams.get("type") ? searchParams.get("type").split(",") : []
  );
  const [bedroom, setBedroom] = useState(
    searchParams.get("bedroom") ? searchParams.get("bedroom").split(",") : []
  );
  const [direction, setDirection] = useState(
    searchParams.get("direction")
      ? searchParams.get("direction").split(",")
      : []
  );

  const [showPropertyTypes, setShowPropertyTypes] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showDirection, setShowDirection] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    const price = searchParams.get("price");
    if (price) {
      const priceArr = price.split("-");
      setMinPrice(priceArr[0]);
      setMaxPrice(priceArr[1]);
    }

    const area = searchParams.get("area");
    if (area) {
      const areaArr = area.split("-");
      setMinArea(areaArr[0]);
      setMaxArea(areaArr[1]);
    }

    axios
      .get("/api/location/cities")
      .then((res) => {
        setCitiesList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (city)
      axios
        .get("/api/location/districts/" + city)
        .then((res) => {
          setDistrictsList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [city]);

  useEffect(() => {
    if (district)
      axios
        .get("/api/location/wards/" + district)
        .then((res) => {
          setWardsList(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [district]);

  const handleSearch = (e) => {
    e.preventDefault();

    let params = new URLSearchParams();
    if (title) params.append("title", title);
    if (city) params.append("city", city);
    if (district) params.append("district", district);
    if (ward) params.append("ward", ward);
    if (minPrice && maxPrice) {
      if (Number(minPrice) > Number(maxPrice)) {
        alert("Giá tối thiểu phải nhỏ hơn giá tối đa");
        return;
      }

      params.append("price", minPrice + "-" + maxPrice);
    }
    if (minArea && maxArea) {
      if (Number(minArea) > Number(maxArea)) {
        alert("Diện tích tối thiểu phải nhỏ hơn diện tích tối đa");
        return;
      }

      params.append("area", minArea + "-" + maxArea);
    }
    if (type.length > 0) params.append("type", type.join(","));
    if (bedroom.length > 0) params.append("bedroom", bedroom);
    if (direction.length > 0) params.append("direction", direction);

    window.location.href = "/tim-kiem?" + params.toString();
  };

  return (
    <div className="px-48">
      <div className="z-50 p-4">
        <div className="relative" id="search-bar"></div>
        <div className="flex items-center justify-between gap-5">
          <form className="my-0 w-full">
            <div className="flex">
              <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="search-dropdown"
                  className="block px-4 py-2 pl-10 w-full z-20 text-gray-900 rounded-lg border bg-gray-100 border-neutral-300 font-semibold"
                  placeholder="Chung cư"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg  transition-all duration-200 px-4 ml-4"
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        <div id="filterFields">
          <div className="flex gap-4 mt-4 text-black">
            <div className="relative">
              <div
                className="px-4 py-3 w-48 rounded-md  border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150 text-black"
                onClick={() => {
                  setShowPropertyTypes((prev) => !prev);
                }}
              >
                {type.length > 0 ? (
                  <p className="truncate w-36">
                    {type
                      .map((item) => {
                        return typesList.find(
                          (typeItem) => typeItem.value == item
                        )?.name;
                      })
                      ?.join(", ")}
                  </p>
                ) : (
                  <span>Loại BĐS</span>
                )}
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>

              <CSSTransition
                in={showPropertyTypes}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div
                  className={
                    "absolute z-50 w-48 bg-white rounded divide-gray-100 shadow top-14"
                  }
                >
                  <ul
                    className="py-1 text-sm text-neutral-900"
                    aria-labelledby="dropdown-button"
                  >
                    {typesList ? (
                      typesList.map((typeItem, index) => {
                        return (
                          <li
                            className="w-full rounded-t-lg border-gray-200"
                            key={index}
                          >
                            <div
                              className="flex items-center px-3 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                if (!type.includes(typeItem.value)) {
                                  setType([...type, typeItem.value]);
                                } else {
                                  setType(
                                    type.filter(
                                      (item) => item != typeItem.value
                                    )
                                  );
                                }
                              }}
                            >
                              <p
                                htmlFor="house-checkbox"
                                className="my-2 w-full text-sm text-gray-900"
                              >
                                {typeItem.name}
                              </p>
                              <input
                                id="house-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-neutral-600 bg-gray-100 rounded border-gray-300 focus:ring-neutral-500 focus:ring-2"
                                checked={type.includes(typeItem.value)}
                              />
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </ul>
                </div>
              </CSSTransition>
            </div>

            <div className="relative">
              <div
                className="px-4 py-3 w-48 rounded-md bg-white border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150"
                onClick={() => setShowLocation((prev) => !prev)}
              >
                <p className="truncate text-black">
                  {ward &&
                    wardsList.find((wardItem) => wardItem.id == ward)?.name +
                      ", "}
                  {district &&
                    districtsList.find(
                      (districtItem) => districtItem.id == district
                    )?.name + ", "}
                  {city &&
                    citiesList.find((cityItem) => cityItem.id == city)?.name}
                  {!ward && !district && !city && <span>Khu vực</span>}
                </p>
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>
              <CSSTransition
                in={showLocation}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div className="absolute z-50 w-48 top-[3.7rem] left-0 bg-white rounded divide-gray-100 shadow">
                  <select
                    onChange={(e) => {
                      setCity(e.target.value);
                      setDistrict("");
                      setWard("");
                    }}
                    value={city}
                    className="w-full p-2 text-sm text-gray-900 bg-white border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 rounded"
                  >
                    <option value="">Tỉnh/Thành phố</option>
                    {citiesList ? (
                      citiesList.map((cityItem) => {
                        return (
                          <option value={cityItem.id} key={cityItem.id}>
                            {cityItem.name}
                          </option>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </select>
                  <select
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setWard("");
                    }}
                    value={district}
                    className="w-full p-2 text-sm text-gray-900 bg-white border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 rounded"
                  >
                    <option value="">Quận/Huyện</option>
                    {districtsList ? (
                      districtsList.map((districtItem) => {
                        return (
                          <option value={districtItem.id} key={districtItem.id}>
                            {districtItem.name}
                          </option>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </select>
                  <select
                    onChange={(e) => {
                      setWard(e.target.value);
                    }}
                    value={ward}
                    className="w-full p-2 text-sm text-gray-900 bg-white border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 rounded"
                  >
                    <option value="">Phường/Xã</option>
                    {wardsList ? (
                      wardsList.map((wardItem) => {
                        return (
                          <option value={wardItem.id} key={wardItem.id}>
                            {wardItem.name}
                          </option>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </select>
                </div>
              </CSSTransition>
            </div>

            <div className="relative">
              <div
                className="px-4 py-3 w-32 rounded-md  border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150 text-black"
                onClick={() => {
                  setShowPrice((prev) => !prev);
                }}
              >
                {minPrice && maxPrice ? (
                  <p className="truncate w-28">
                    {minPrice} - {maxPrice} tỷ
                  </p>
                ) : (
                  <span>Mức giá</span>
                )}
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>

              <CSSTransition
                in={showPrice}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div className="absolute z-50 w-52 top-[3.7rem] left-0 bg-white rounded divide-gray-100 shadow px-6 py-2">
                  <p className="mt-2.5 font-semibold">Mức giá</p>
                  <div className="flex items-center justify-center my-2 text-sm">
                    <input
                      onChange={(e) => {
                        setMaxPrice((prev) => {
                          if (!prev || prev < e.target.value) {
                            return e.target.value;
                          }
                          return prev;
                        });

                        setMinPrice(e.target.value < 0 ? 0 : e.target.value);
                      }}
                      value={minPrice}
                      type="number"
                      min={0}
                      step={0.1}
                      className="w-1/2 h-8 px-2 border border-gray-300\ focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <p className="w-1/4 h-8 flex items-center justify-center">
                      -
                    </p>
                    <input
                      onChange={(e) => {
                        setMaxPrice(e.target.value < 0 ? 0 : e.target.value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value < minPrice) {
                          setMaxPrice(minPrice);
                        }
                      }}
                      value={maxPrice}
                      type="number"
                      min={minPrice}
                      step={0.1}
                      className="w-1/2 h-8 px-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="w-1/4 h-8 flex items-center justify-center">
                      Tỷ
                    </p>
                  </div>
                </div>
              </CSSTransition>
            </div>

            <div className="relative">
              <div
                className="px-4 py-3 w-32 rounded-md border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150 text-black"
                onClick={() => {
                  setShowArea((prev) => !prev);
                }}
              >
                {minArea && maxArea ? (
                  <p className="truncate w-28">
                    {minArea} - {maxArea} m<sup>2</sup>
                  </p>
                ) : (
                  <span>Diện tích</span>
                )}
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>

              <CSSTransition
                in={showArea}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div className="absolute z-50 w-52 top-[3.7rem] left-0 bg-white rounded divide-gray-100 shadow right-[20.8vw] px-6 py-2">
                  <p className="mt-2.5 font-semibold">Diện tích</p>
                  <div className="flex items-center justify-center my-2 text-sm">
                    <input
                      onChange={(e) => {
                        setMaxArea((prev) => {
                          if (!prev || prev < e.target.value) {
                            return e.target.value;
                          }
                          return prev;
                        });

                        setMinArea(e.target.value < 0 ? 0 : e.target.value);
                      }}
                      value={minArea}
                      type="number"
                      min={0}
                      step={0.1}
                      className="w-1/2 h-8 px-2 border border-gray-300\ focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <p className="w-1/4 h-8 flex items-center justify-center">
                      -
                    </p>
                    <input
                      onChange={(e) => {
                        setMaxArea(e.target.value < 0 ? 0 : e.target.value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value < minArea) {
                          setMaxArea(minArea);
                        }
                      }}
                      value={maxArea}
                      type="number"
                      min={minArea}
                      step={0.1}
                      className="w-1/2 h-8 px-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="w-1/4 h-8 flex items-center justify-center">
                      m<sup>2</sup>
                    </p>
                  </div>
                </div>
              </CSSTransition>
            </div>

            <div className="relative">
              <div
                className="px-4 py-3 w-48 rounded-md border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150 text-black"
                onClick={() => setShowDirection((prev) => !prev)}
              >
                {direction ? (
                  <p className="truncate w-28">
                    {directionsList
                      .map((directionItem) => {
                        return direction.includes(directionItem.value)
                          ? directionItem.name
                          : null;
                      })
                      ?.filter((item) => item)
                      .join(", ") || "Hướng nhà"}
                  </p>
                ) : (
                  <span>Hướng nhà</span>
                )}
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>

              <CSSTransition
                in={showDirection}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div
                  className={
                    "absolute z-50 w-48 bg-white rounded divide-gray-100 shadow top-14"
                  }
                >
                  <ul
                    className="py-1 text-sm text-neutral-900"
                    aria-labelledby="dropdown-button"
                  >
                    {directionsList ? (
                      directionsList.map((directionItem, index) => {
                        return (
                          <li
                            className="w-full rounded-t-lg border-gray-200"
                            key={index}
                          >
                            <div
                              className="flex items-center px-3 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                if (!direction.includes(directionItem.value)) {
                                  setDirection([
                                    ...direction,
                                    directionItem.value,
                                  ]);
                                } else {
                                  setDirection(
                                    direction.filter(
                                      (item) => item != directionItem.value
                                    )
                                  );
                                }
                              }}
                            >
                              <p
                                htmlFor="house-checkbox"
                                className="my-2 w-full text-sm text-gray-900"
                              >
                                {directionItem.name}
                              </p>
                              <input
                                id="house-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-neutral-600 bg-gray-100 rounded border-gray-300 focus:ring-neutral-500 focus:ring-2"
                                checked={direction.includes(
                                  directionItem.value
                                )}
                              />
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </ul>
                </div>
              </CSSTransition>
            </div>

            <div className="relative">
              <div
                className="px-4 py-3 w-48 rounded-md border focus:border-gray-500 focus:bg-white focus:ring-0 text-sm cursor-pointer hover:bg-white hover:border hover:border-gray-500 transition-all duration-150 text-black"
                onClick={() => setShowRooms((prev) => !prev)}
              >
                <p className="truncate w-28">
                  {bedroom?.length > 0
                    ? bedroom.sort().join(", ") + " phòng ngủ"
                    : "Phòng ngủ"}
                </p>
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-3" />
              </div>

              <CSSTransition
                in={showRooms}
                timeout={300}
                classNames="list-dropdown"
                unmountOnExit
              >
                <div
                  className={
                    "absolute z-50 w-48 bg-white rounded divide-gray-100 shadow top-14"
                  }
                >
                  <ul
                    className="py-1 text-sm text-neutral-900"
                    aria-labelledby="dropdown-button"
                  >
                    {bedroomList ? (
                      bedroomList.map((bedroomItem, index) => {
                        return (
                          <li
                            className="w-full rounded-t-lg border-gray-200"
                            key={index}
                          >
                            <div
                              className="flex items-center px-3 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                if (!bedroom.includes(bedroomItem.value)) {
                                  setBedroom([...bedroom, bedroomItem.value]);
                                } else {
                                  setBedroom(
                                    bedroom.filter(
                                      (item) => item != bedroomItem.value
                                    )
                                  );
                                }
                              }}
                            >
                              <p
                                htmlFor="house-checkbox"
                                className="my-2 w-full text-sm text-gray-900"
                              >
                                {bedroomItem.name}
                              </p>
                              <input
                                id="house-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 text-neutral-600 bg-gray-100 rounded border-gray-300 focus:ring-neutral-500 focus:ring-2"
                                checked={bedroom.includes(bedroomItem.value)}
                              />
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center w-full h-20">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </ul>
                </div>
              </CSSTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
