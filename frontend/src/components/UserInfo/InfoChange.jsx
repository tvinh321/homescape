import { useState, useContext, useEffect, useRef } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import axios from "../../axiosConfig";

export default function InfoChange() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    ward: "",
    street: "",
  });

  const [error, setError] = useState({
    serverError: "",
    name: "",
    phone: "",
  });

  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const ranOnce = useRef(false);

  useEffect(() => {
    if (!user) {
      window.location.href = "/dang-nhap";
    }

    axios
      .get(`/api/user/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserInfo(res.data.data);
        setStreet(res.data.data.street);
        setWard(res.data.data.ward);
        setDistrict(res.data.data.district);
        setCity(res.data.data.city);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    if (!ranOnce.current) {
      ranOnce.current = true;
      axios.get("/api/location/cities").then((res) => {
        setCities(res.data);
      });
    }
  }, []);

  useEffect(() => {
    if (!city) return;
    axios.get(`/api/location/districts/${city}`).then((res) => {
      setDistricts(res.data);
    });
  }, [city]);

  useEffect(() => {
    if (!district) return;
    axios.get(`/api/location/wards/${district}`).then((res) => {
      setWards(res.data);
    });
  }, [district]);

  useEffect(() => {
    let address = [];

    street && address.push(street);
    ward && address.push(wards.find((wardItem) => wardItem.id == ward)?.name);
    district &&
      address.push(
        districts.find((districtItem) => districtItem.id == district)?.name
      );
    city && address.push(cities.find((cityItem) => cityItem.id == city)?.name);

    setAddress(address.join(", "));
  }, [street, ward, district, city, wards, districts, cities]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let submit = {
      name: userInfo.name,
      phone: userInfo.phone,
      ward: ward,
      street: street,
    };

    axios
      .post("/api/user/info", submit, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setError({ name: "", phone: "" });
        window.location.reload();
      })
      .catch((err) => {
        setError({ ...error, serverError: err.response.data.message });
      });
  };

  return (
    <div className="bg-white h-full pt-16 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Thông tin cá nhân</h1>
        {error.serverError && (
          <div className="bg-red-200 text-red-700 px-8 py-4 mb-4 w-2/3 text-center font-semibold">
            {error.serverError}
          </div>
        )}
        <form
          className="flex flex-col w-full items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-2/5">
            <label htmlFor="name" className="font-semibold mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="border rounded-md py-2 px-2 mb-2"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            />
            {error.name && <div className="text-red-500">{error.name}</div>}

            <label htmlFor="phone" className="font-semibold mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="border rounded-md py-2 px-2 mb-2"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
            />
            {error.phone && <div className="text-red-500">{error.phone}</div>}

            <label htmlFor="address" className="font-semibold mb-1">
              Địa chỉ
            </label>

            <div>
              <select
                className="border rounded-lg px-4 py-2 w-full"
                name="city"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Chọn thành phố</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-lg px-4 py-2 w-full mt-4"
                name="district"
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>

              <select
                className="border rounded-lg px-4 py-2 w-full mt-4"
                name="ward"
                id="ward"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="street"
                id="street"
                placeholder="Số nhà, tên đường"
                className="border rounded-lg px-4 py-2 w-full mt-4"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                type="text"
                name="address"
                id="address"
                className="border border-gray-400 rounded-md py-2 px-2 mb-2 mt-4 w-full bg-gray-200 text-gray-700 cursor-default"
                value={address}
                readOnly
              />
            </div>

            <button
              type="submit"
              className="bg-blue-700 text-white hover:bg-blue-800 font-bold py-2 px-4 rounded transition-all duration-150 flex justify-center items-center mt-8"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
