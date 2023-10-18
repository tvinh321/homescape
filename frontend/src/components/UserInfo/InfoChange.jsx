import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../contexts/AuthContext";

import axios from "axios";

export default function InfoChange() {
  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
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

  // useEffect(() => {
  //   if (!user) {
  //     window.location.href = "/dang-nhap";
  //   }

  //   axios
  //     .get(`/api/userinfo`)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [user]);

  useEffect(() => {
    // axios.get("/api/location/cities").then((res) => {
    //   setCities(res.data.cities);
    // });
    setCities([
      {
        id: 1,
        name: "Hồ Chí Minh",
      },
    ]);
  }, []);

  useEffect(() => {
    // axios.get(`/api/location/districts/${city}`).then((res) => {
    //   setDistricts(res.data.districts);
    // });
    setDistricts([
      {
        id: 1,
        name: "Quận 1",
      },
    ]);
  }, [city]);

  useEffect(() => {
    // axios.get(`/api/location/wards/${district}`).then((res) => {
    //   setWards(res.data.wards);
    // });
    setWards([
      {
        id: 1,
        name: "Phường 1",
      },
    ]);
  }, [district]);

  useEffect(() => {
    let address = [];

    street && address.push(street);
    ward && address.push(ward);
    district && address.push(district);
    city && address.push(city);

    setAddress(address.join(", "));
  }, [street, ward, district, city]);

  return (
    <div className="bg-white h-full pt-16 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-8">Thông tin cá nhân</h1>
        <form className="flex flex-col w-full items-center">
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

            <label htmlFor="email" className="font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border rounded-md py-2 px-2 mb-2"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            {error.email && <div className="text-red-500">{error.email}</div>}

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
                  <option key={city.id} value={city.name}>
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
                  <option key={district.id} value={district.name}>
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
                  <option key={ward.id} value={ward.name}>
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
