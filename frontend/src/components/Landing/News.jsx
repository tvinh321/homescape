import React from "react";

export default function News() {
  const [houseList, setHouseList] = React.useState(null);

  return (
    <div className="bg-white w-full px-48 pt-10 pb-20">
      <h1 className="font-bold text-3xl mt-4">Tin tức</h1>

      {/* <!-- House Selection with Grids 3 columns, 2 rows --> */}
      <div className="mx-auto mt-16">
        <div id="priority-house"></div>

        {/* Second Script */}
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-8">
          {houseList ? (
            houseList.map((house, index) => {
              return (
                <a href={`/thong-tin/${house.id}`} key={index}>
                  <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-150 border border-gray-300 relative h-[380px] bg-white">
                    <div className="h-48">
                      <img
                        className="object-cover h-full w-full"
                        src={`/api/property/${house.id}/${house.image.content}`}
                        alt="Ảnh nhà đất"
                      />
                    </div>
                    <div className="px-6 py-4">
                      <div className="font-bold leading-relaxed mt-2 truncate">
                        {house.title}
                      </div>
                      <p className="text-gray-700 text-sm">
                        {(house.price / 1000000000).toFixed(1)} tỷ -{" "}
                        {house.area} m<sup>2</sup>
                      </p>
                      <p className="mt-4 text-gray-700 text-sm">
                        {house.location}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 h-10 absolute bottom-0 w-full">
                      <div className="border border-gray-200 flex justify-center items-center">
                        <svg
                          className="mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 512 512"
                        >
                          <title>ionicons-v5-g</title>
                          <path
                            d="M384,240H96V136a40.12,40.12,0,0,1,40-40H376a40.12,40.12,0,0,1,40,40V240Z"
                            style={{
                              fill: "none",
                              stroke: "#000",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "32px",
                            }}
                          />
                          <path
                            d="M48,416V304a64.19,64.19,0,0,1,64-64H400a64.19,64.19,0,0,1,64,64V416"
                            style={{
                              fill: "none",
                              stroke: "#000",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "32px",
                            }}
                          />
                          <path
                            d="M48,416v-8a24.07,24.07,0,0,1,24-24H440a24.07,24.07,0,0,1,24,24v8"
                            style={{
                              fill: "none",
                              stroke: "#000",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "32px",
                            }}
                          />
                          <path
                            d="M112,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
                            style={{
                              fill: "none",
                              stroke: "#000",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "32px",
                            }}
                          />
                          <path
                            d="M256,240V224a32.09,32.09,0,0,1,32-32h80a32.09,32.09,0,0,1,32,32v16"
                            style={{
                              fill: "none",
                              stroke: "#000",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: "32px",
                            }}
                          />
                        </svg>
                        <p className="font-bold">{house.num_of_bedrooms}</p>
                      </div>
                      <div className="border border-gray-200 flex justify-center items-center">
                        <svg
                          className="mr-2"
                          style={{
                            color: "rgb(23, 23, 23)",
                          }}
                          width="16"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          {" "}
                          <path
                            fill="#171717"
                            d="M464,280H80V100A51.258,51.258,0,0,1,95.113,63.515l.4-.4a51.691,51.691,0,0,1,58.6-10.162,79.1,79.1,0,0,0,11.778,96.627l10.951,10.951-20.157,20.158,22.626,22.626,20.157-20.157h0L311.157,71.471h0l20.157-20.157L308.687,28.687,288.529,48.844,277.578,37.893a79.086,79.086,0,0,0-100.929-8.976A83.61,83.61,0,0,0,72.887,40.485l-.4.4A83.054,83.054,0,0,0,48,100V280H16v32H48v30.7a23.95,23.95,0,0,0,1.232,7.589L79,439.589A23.969,23.969,0,0,0,101.766,456h12.9L103,496h33.333L148,456H356.1l12,40H401.5l-12-40h20.73A23.969,23.969,0,0,0,433,439.589l29.766-89.3A23.982,23.982,0,0,0,464,342.7V312h32V280ZM188.52,60.52a47.025,47.025,0,0,1,66.431,0L265.9,71.471,199.471,137.9,188.52,126.951A47.027,47.027,0,0,1,188.52,60.52ZM432,341.4,404.468,424H107.532L80,341.4V312H432Z"
                            className="ci-primary"
                          ></path>{" "}
                        </svg>
                        <p className="font-bold">{house.num_of_toilets}</p>
                      </div>
                      <div className="border border-gray-200 flex justify-center items-center">
                        <svg
                          className="mr-2"
                          width="16"
                          height="16"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22,7V5h-3V2h-2v3h-4V2h-2v3H7V2H5v3H2v2h3v4H2v2h3v4H2v2h3v3h2v-3h4v3h2v-3h4v3h2v-3h3v-2h-3v-4h3v-2h-3V7H22z M7,7h4v4 H7V7z M7,17v-4h4v4H7z M17,17h-4v-4h4V17z M17,11h-4V7h4V11z" />
                        </svg>
                        <p className="font-bold">4</p>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            // Loading Spinner
            <div className="flex items-center">
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
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <p className="text-gray-900">Đang tải...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
