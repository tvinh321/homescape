import { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { typesList, directionsList } from "../constants/properties";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import axios from "../axiosConfig";

export default function PostProperty() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [floor, setFloor] = useState("");
  const [panorama, setPanorama] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const ranOnce = useRef(false);

  useEffect(() => {
    if (!ranOnce.current) {
      ranOnce.current = true;
      axios.get("/api/location/cities").then((res) => {
        setCities(res.data.cities);
      });
    }
  }, []);

  useEffect(() => {
    axios.get(`/api/location/districts/${city}`).then((res) => {
      setDistricts(res.data.districts);
    });
  }, [city]);

  useEffect(() => {
    axios.get(`/api/location/wards/${district}`).then((res) => {
      setWards(res.data.wards);
    });
  }, [district]);

  useEffect(() => {
    let address = [];

    street && address.push(street);
    ward && address.push(ward);
    district && address.push(district);
    city && address.push(city);

    setAddress(address.join(", "));
  }, [street, ward, district, city]);

  const checkValid = () => {
    if (!title) {
      alert("Vui lòng nhập tiêu đề");
      return false;
    }

    if (!address || !street || !city || !district || !ward) {
      alert("Vui lòng nhập đầy đủ địa chỉ");
      return false;
    }

    if (!description) {
      alert("Vui lòng nhập mô tả");
      return false;
    }

    if (!type) {
      alert("Vui lòng chọn loại bất động sản");
      return false;
    }

    if (!price) {
      alert("Vui lòng nhập giá");
      return false;
    }

    if (!area) {
      alert("Vui lòng nhập diện tích");
      return false;
    }

    if (!direction) {
      alert("Vui lòng chọn hướng");
      return false;
    }

    if (["nha", "chungcu"].includes(type)) {
      if (!bedroom) {
        alert("Vui lòng nhập số phòng ngủ");
        return false;
      }

      if (!bathroom) {
        alert("Vui lòng nhập số phòng tắm");
        return false;
      }
    }

    if (type == "nha") {
      if (!floor) {
        alert("Vui lòng nhập số tầng");
        return false;
      }
    }

    if (!images.length) {
      alert("Vui lòng thêm ít nhất 1 ảnh");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkValid();
  };

  return (
    <>
      <Header />
      <div className="mx-40 mt-12 mb-24">
        <h1 className="font-semibold text-2xl mb-6">Chỉnh sửa bài đăng</h1>
        <div className="border px-12 py-8 shadow-md rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="mb-2 font-semibold" htmlFor="title">
                Tiêu đề
              </label>
              <input
                className="border rounded-lg px-4 py-2"
                type="text"
                name="title"
                id="title"
                placeholder="Nhập tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="mb-2 font-semibold mt-4" htmlFor="address">
                Địa chỉ
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  className="border rounded-lg px-4 py-2"
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Chọn thành phố</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg px-4 py-2"
                  name="district"
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>

                <select
                  className="border rounded-lg px-4 py-2"
                  name="ward"
                  id="ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                className="border rounded-lg px-4 py-2 mt-2"
                type="text"
                name="street"
                id="street"
                placeholder="Nhập số nhà, tên đường"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <label className="mb-2 font-semibold mt-4" htmlFor="description">
                Mô tả
              </label>
              <textarea
                className="border rounded-lg px-4 py-2 min-h-[10rem]"
                name="description"
                id="description"
                cols="30"
                rows="10"
                placeholder="Nhập mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="w-full border-b mt-10"></div>

              <label className="mb-2 font-semibold mt-4" htmlFor="type">
                Loại bất động sản
              </label>
              <select
                className="border rounded-lg px-4 py-2"
                name="type"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" selected disabled>
                  Chọn loại bất động sản
                </option>
                {typesList.map((type) => (
                  <option key={type.id} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>

              <label className="mb-2 font-semibold mt-4" htmlFor="price">
                Giá
              </label>
              <input
                className="border rounded-lg px-4 py-2"
                type="number"
                name="price"
                id="price"
                placeholder="Nhập giá"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label className="mb-2 font-semibold mt-4" htmlFor="area">
                Diện tích
              </label>
              <input
                className="border rounded-lg px-4 py-2"
                type="number"
                name="area"
                id="area"
                placeholder="Nhập diện tích"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

              <label className="mb-2 font-semibold mt-4" htmlFor="direction">
                Hướng
              </label>
              <select
                className="border rounded-lg px-4 py-2"
                name="direction"
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
              >
                <option value="" selected disabled>
                  Chọn hướng
                </option>
                {directionsList.map((direction) => (
                  <option key={direction.id} value={direction.value}>
                    {direction.name}
                  </option>
                ))}
              </select>

              {["nha", "chungcu"].includes(type) && (
                <>
                  <label className="mb-2 font-semibold mt-4" htmlFor="bedroom">
                    Số phòng ngủ
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2"
                    type="number"
                    name="bedroom"
                    id="bedroom"
                    placeholder="Nhập số phòng ngủ"
                    value={bedroom}
                    onChange={(e) => setBedroom(e.target.value)}
                  />

                  <label className="mb-2 font-semibold mt-4" htmlFor="bathroom">
                    Số phòng tắm
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2"
                    type="number"
                    name="bathroom"
                    id="bathroom"
                    placeholder="Nhập số phòng tắm"
                    value={bathroom}
                    onChange={(e) => setBathroom(e.target.value)}
                  />
                </>
              )}

              {type == "nha" && (
                <>
                  <label className="mb-2 font-semibold mt-4" htmlFor="floor">
                    Số tầng
                  </label>
                  <input
                    className="border rounded-lg px-4 py-2"
                    type="number"
                    name="floor"
                    id="floor"
                    placeholder="Nhập số tầng"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                </>
              )}

              <div className="w-full border-b mt-10"></div>

              <label className="mb-2 font-semibold mt-4" htmlFor="images">
                Hình ảnh
              </label>
              <div className="grid grid-cols-4 gap-2">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      className="w-full h-40 object-cover rounded-lg"
                      src={image.url}
                      alt={image.name}
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      onClick={() =>
                        setImages(images.filter((i) => i.id !== image.id))
                      }
                      type="button"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="h-40 w-full border">
                  <label
                    className="flex justify-center items-center bg-gray-100 rounded-lg cursor-pointer h-full"
                    htmlFor="images"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                      <p>Thêm ảnh</p>
                      <input
                        className="hidden"
                        type="file"
                        name="images"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          const newImages = [];
                          for (let i = 0; i < files.length; i++) {
                            newImages.push({
                              id: i,
                              name: files[i].name,
                              url: URL.createObjectURL(files[i]),
                            });
                          }
                          setImages([...images, ...newImages]);
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <label className="mb-2 font-semibold mt-4" htmlFor="panoramas">
                Ảnh 360<sup>o</sup>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {panorama.map((pano) => (
                  <div key={pano.id} className="relative">
                    <img
                      className="w-full h-40 object-cover rounded-lg"
                      src={pano.url}
                      alt={pano.name}
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center"
                      onClick={() =>
                        setPanorama(pano.filter((i) => i.id !== pano.id))
                      }
                      type="button"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="h-40 w-full border">
                  <label
                    className="flex justify-center items-center bg-gray-100 rounded-lg cursor-pointer h-full"
                    htmlFor="panoramas"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                      <p>Thêm ảnh</p>
                      <input
                        className="hidden"
                        type="file"
                        name="panoramas"
                        id="panoramas"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          const newPanos = [];
                          for (let i = 0; i < files.length; i++) {
                            newPanos.push({
                              id: i,
                              name: files[i].name,
                              url: URL.createObjectURL(files[i]),
                            });
                          }
                          setPanorama([...panorama, ...newPanos]);
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <label className="mb-2 font-semibold mt-4" htmlFor="videos">
                Video (dưới dạng link Youtube)
              </label>
              {videos.map((video) => (
                <div key={video.id} className="relative">
                  <input
                    className="border rounded-lg px-4 py-2 mb-2 w-full"
                    type="text"
                    name="videos"
                    id="videos"
                    placeholder="Nhập link video"
                    value={video.url}
                    onChange={(e) => {
                      const newVideos = [...videos];
                      newVideos[video.id].url = e.target.value;
                      setVideos(newVideos);
                    }}
                  />
                  <button
                    className="absolute top-2.5 right-2 bg-red-600 text-white rounded-full w-5 h-5 flex justify-center items-center"
                    onClick={() =>
                      setVideos(videos.filter((i) => i.id !== video.id))
                    }
                    type="button"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                className="flex mt-2 w-fit text-blue-600"
                onClick={() =>
                  setVideos([
                    ...videos,
                    {
                      id: videos.length,
                      url: "",
                    },
                  ])
                }
                type="button"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span className="ml-1 font-semibold">Thêm video</span>
              </button>
            </div>

            <div className="w-full flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                type="submit"
              >
                Hoàn thành
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
