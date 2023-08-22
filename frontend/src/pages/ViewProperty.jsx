import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { baseURL } from "../axiosConfig";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import ReactPannellum from "react-pannellum";
import Youtube from "react-youtube";

import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { SwitchTransition, CSSTransition } from "react-transition-group";

const videoCode = (url) => {
  return url?.includes("watch")
    ? url?.split("v=")[1].split("&")[0]
    : url?.includes("short")
    ? url?.split("shorts/")[1]
    : url?.split("youtu.be/")[1];
};

const propertyMock = {
  id: 1,
  title: "Căn hộ chung cư",
  address: "123 Đường ABC, Quận XYZ, TP. HCM",
  price: 1000000000,
  area: 100,
  description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem, omnis blanditiis enim quis nulla maiores porro nostrum quas fuga rem impedit eligendi odit est minus magnam ipsum ducimus. Atque, autem. 
    
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, sapiente. Eius culpa facilis repellat optio. Vel magnam nostrum quisquam perspiciatis totam tempora natus est suscipit maiores commodi quaerat, consequatur blanditiis.
    `,
  files: [
    {
      type: "image",
      url: "https://picsum.photos/200/300",
    },
    {
      type: "image",
      url: "https://picsum.photos/200/300",
    },
    {
      type: "image",
      url: "https://picsum.photos/200/300",
    },
    {
      type: "pano",
      url: "https://picsum.photos/200/300",
    },
    {
      type: "pano",
      url: "https://picsum.photos/200/300",
    },
    {
      type: "video",
      url: "https://www.youtube.com/watch?v=2g811Eo7K8U",
    },
  ],
  type: "Căn hộ",
  direction: "Đông Nam",
  user: {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "abc@abc.con",
  },
};

export default function ViewProperty() {
  const { user, setUser } = useContext(AuthContext);
  const { id } = useParams();
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <>
      <Header />
      <div className="px-48 mt-10 mb-36">
        <div className="flex">
          <div className="w-3/4">
            <Carousel
              showThumbs={false}
              showStatus={false}
              interval={3000}
              centerMode={true}
              centerSlidePercentage={90}
            >
              {propertyMock?.files
                ?.filter((item) => item.type == "pano")
                ?.map((item, index) => (
                  <div className="w-full h-full px-2" key={"pano" + index}>
                    <ReactPannellum
                      id={"pano" + index}
                      className="object-cover h-full w-full"
                      imageSource={item?.url}
                      pitch={10}
                      config={{
                        autoLoad: true,
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000000",
                      }}
                    />
                  </div>
                ))}

              {propertyMock?.files
                ?.filter((item) => item.type == "video")
                ?.map((item, index) => (
                  <div className="w-full h-full" key={"video" + index}>
                    <Youtube
                      className="h-full w-full px-2"
                      containerClassName="embed embed-youtube"
                      opts={{ width: "100%", height: "100%" }}
                      videoId={videoCode(item?.url)}
                    />
                  </div>
                ))}

              {propertyMock?.files
                ?.filter((item) => item.type == "image")
                ?.map((image, index) => (
                  <div key={"image" + index} className="w-full h-full">
                    <img
                      src={image?.url}
                      alt="property"
                      className="object-cover h-[36rem] w-full px-2"
                    />
                  </div>
                ))}
            </Carousel>
            <div className="mt-8">
              <h1 className="font-semibold text-3xl mb-1">
                {propertyMock.title}
              </h1>
              <h2 className="text-gray-400 mb-6">{propertyMock.address}</h2>
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-red-600">
                  {propertyMock.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h1>
                <span className="ml-5 text-gray-400">
                  {propertyMock.area} m<sup>2</sup>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
                <p>
                  <span className="font-semibold">Loại:</span>{" "}
                  {propertyMock.type}
                </p>
                <p>
                  <span className="font-semibold">Hướng:</span>{" "}
                  {propertyMock.direction}
                </p>
                <p>
                  <span className="font-semibold">Phòng ngủ:</span> 3
                </p>
                <p>
                  <span className="font-semibold">Phòng tắm:</span> 2
                </p>
                <p>
                  <span className="font-semibold">Số tầng:</span> 2
                </p>
                <p>
                  <span className="font-semibold">Số phòng:</span> 5
                </p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-300 my-10"></div>
            <h1 className="font-semibold text-2xl mb-4">Mô tả</h1>
            <p className="leading-relaxed whitespace-pre-wrap">
              {propertyMock.description}
            </p>
            <h1 className="font-semibold text-2xl mb-4 mt-6">Bản đồ</h1>
            <iframe
              className="w-full h-96"
              title="map"
              src={`https://maps.google.com/maps?hl=vi&q=${propertyMock?.address}&ie=UTF8&t=&z=14&iwloc=B&output=embed`}
            />
          </div>
          <div className="w-1/4 ml-10 flex flex-col items-center py-10">
            <p>Được đăng bởi</p>
            <img
              src="https://picsum.photos/200/300"
              alt="avatar"
              className="rounded-full w-32 h-32 my-4 object-cover"
            />
            <h1 className="text-2xl font-bold">{propertyMock?.user?.name}</h1>
            <button
              className="flex border rounded-xl px-6 py-3 mt-4 bg-blue-600 text-white font-semibold justify-center items-center hover:bg-blue-700 transition-all duration-200 w-56"
              onClick={() => setShowPhone((prev) => !prev)}
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              <SwitchTransition>
                <CSSTransition
                  key={showPhone}
                  timeout={100}
                  classNames="fade"
                  unmountOnExit={false}
                >
                  {showPhone ? (
                    <p>Xem SĐT</p>
                  ) : (
                    <p>{propertyMock?.user?.phone}</p>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </button>
            <button
              className="flex border rounded-xl px-6 py-3 mt-4 bg-white text-black font-semibold justify-center items-center hover:bg-blue-100 transition-all duration-200 w-56"
              onClick={() => setShowEmail((prev) => !prev)}
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              <SwitchTransition>
                <CSSTransition
                  key={showEmail}
                  timeout={100}
                  classNames="fade"
                  unmountOnExit={false}
                >
                  {showEmail ? (
                    <p>Xem Email</p>
                  ) : (
                    <p>{propertyMock?.user?.email}</p>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
