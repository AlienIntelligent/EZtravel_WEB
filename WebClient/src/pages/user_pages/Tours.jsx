import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const itineraryData = [
  {
    id: 1,
    title: "Đà Nẵng 3N2Đ",
    destination: "Đà Nẵng",
    image: "/images/destination-1.jpg",
    budget: "4.500.000đ",
    days: 3,
    nights: 2,
    rating: 4.8,
    reviews: 120,
    description: "Khám phá Bà Nà Hills, biển Mỹ Khê và phố cổ Hội An.",
    highlights: ["Bà Nà", "Biển", "Hội An"],
  },
  {
    id: 2,
    title: "Đà Lạt Chill",
    destination: "Đà Lạt",
    image: "/images/destination-2.jpg",
    budget: "3.800.000đ",
    days: 4,
    nights: 3,
    rating: 4.7,
    reviews: 98,
    description: "Săn mây, cà phê chill và homestay view rừng thông.",
    highlights: ["Săn mây", "Cafe", "Check-in"],
  },
  {
    id: 3,
    title: "Phú Quốc Tự Túc",
    destination: "Phú Quốc",
    image: "/images/destination-3.jpg",
    budget: "6.200.000đ",
    days: 3,
    nights: 2,
    rating: 4.9,
    reviews: 210,
    description: "Resort biển, tour đảo và hoàng hôn Sunset Town.",
    highlights: ["Resort", "Biển", "Sunset"],
  },
];

const Rating = ({ value, reviews }) => (
  <p className="rate">
    {[0, 1, 2, 3, 4].map((index) => (
      <i
        key={index}
        className={index < Math.round(value) ? "icon-star" : "icon-star-o"}
      ></i>
    ))}
    <span>{reviews} đánh giá</span>
  </p>
);

function Itinerary() {
  const [keyword, setKeyword] = useState("");
  const [budget, setBudget] = useState(10000000);

  const filteredTrips = useMemo(() => {
    return itineraryData.filter((item) => {
      const matchKeyword =
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.destination.toLowerCase().includes(keyword.toLowerCase());

      const numericBudget = Number(item.budget.replace(/\D/g, ""));

      return matchKeyword && numericBudget <= budget;
    });
  }, [keyword, budget]);

  return (
    <>
      {/* HERO */}
      <div
        className="hero-wrap js-fullheight"
        style={{
          backgroundImage: 'url("/images/bg_3.jpg")',
        }}
      >
        <div className="overlay"></div>

        <div className="container">
          <div
            className="row no-gutters slider-text js-fullheight align-items-center justify-content-center"
            data-scrollax-parent="true"
          >
            <div className="col-md-9 ftco-animate text-center">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <Link to="/">Trang chủ</Link>
                </span>

                <span>Điểm đến</span>
              </p>

              <h1 className="mb-3 bread">Điểm đến</h1>

              <p className="caps">
                Khám phá Việt Nam theo cách riêng của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="ftco-section ftco-degree-bg">
        <div className="container">
          <div className="row">
            {/* SIDEBAR */}
            <div className="col-lg-3 sidebar ftco-animate">
              <div className="sidebar-wrap bg-light ftco-animate">
                <h3 className="heading mb-4">Tìm lịch trình</h3>

                <div className="fields">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bạn muốn đi đâu?"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngân sách tối đa</label>

                    <input
                      type="range"
                      className="form-control"
                      min="1000000"
                      max="10000000"
                      step="500000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />

                    <small>{budget.toLocaleString("vi-VN")}đ</small>
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary py-3 px-5" type="button">
                      {filteredTrips.length} kết quả
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION */}
              <div className="sidebar-wrap bg-light ftco-animate">
                <h3 className="heading mb-4">Tạo nhanh</h3>

                <button className="btn btn-outline-primary btn-block mb-3">
                  + Tạo lịch trình mới
                </button>

                <button className="btn btn-outline-secondary btn-block">
                  📌 Lịch trình đã lưu
                </button>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-lg-9">
              <div className="row">
                {filteredTrips.map((trip) => (
                  <div className="col-md-4 ftco-animate" key={trip.id}>
                    <div className="destination">
                      <Link
                        to="/itinerary"
                        className="img img-2 d-flex justify-content-center align-items-center"
                        style={{
                          backgroundImage: `url(${trip.image})`,
                        }}
                      >
                        <div className="icon d-flex justify-content-center align-items-center">
                          <span className="icon-search2"></span>
                        </div>
                      </Link>

                      <div className="text p-3">
                        <div className="d-flex">
                          <div className="one">
                            <h3>
                              <Link to="/itinerary">{trip.title}</Link>
                            </h3>

                            <Rating
                              value={trip.rating}
                              reviews={trip.reviews}
                            />
                          </div>

                          <div className="two">
                            <span className="price">{trip.budget}</span>
                          </div>
                        </div>

                        <p>{trip.description}</p>

                        <p className="days">
                          <span>
                            {trip.days} ngày {trip.nights} đêm
                          </span>
                        </p>

                        <p className="mb-2">
                          {trip.highlights.map((item) => (
                            <span className="badge badge-light mr-1" key={item}>
                              {item}
                            </span>
                          ))}
                        </p>

                        <hr />

                        <p className="bottom-area d-flex">
                          <span>
                            <i className="icon-map-o"></i> {trip.destination}
                          </span>

                          <span className="ml-auto">
                            <Link to="/itinerary">Xem</Link>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTrips.length === 0 && (
                <div className="alert alert-light border">
                  Không có lịch trình phù hợp.
                </div>
              )}

              {/* PAGINATION */}
              <div className="row mt-5">
                <div className="col text-center">
                  <div className="block-27">
                    <ul>
                      <li>
                        <span>&lt;</span>
                      </li>

                      <li className="active">
                        <span>1</span>
                      </li>

                      <li>
                        <span>2</span>
                      </li>

                      <li>
                        <span>&gt;</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Itinerary;
