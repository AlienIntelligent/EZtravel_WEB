import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialDays = [
  {
    day: 1,
    title: "Khám phá Đà Nẵng",
    progress: 70,
    activities: [
      {
        time: "07:00",
        name: "Ăn sáng bún chả cá",
        location: "Hải Châu",
        type: "food",
      },
      {
        time: "09:00",
        name: "Bà Nà Hills",
        location: "Hòa Vang",
        type: "place",
      },
      {
        time: "15:00",
        name: "Biển Mỹ Khê",
        location: "Sơn Trà",
        type: "beach",
      },
    ],
  },
  {
    day: 2,
    title: "Cafe & Hội An",
    progress: 40,
    activities: [
      {
        time: "08:00",
        name: "Cafe phố cổ",
        location: "Hội An",
        type: "cafe",
      },
    ],
  },
];

function Itinerary() {
  const [days, setDays] = useState(initialDays);

  const [activeTab, setActiveTab] = useState("timeline");

  const totalActivities = days.reduce(
    (total, day) => total + day.activities.length,
    0,
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const dayIndex = days.findIndex(
      (day) => day.day.toString() === result.source.droppableId,
    );

    if (dayIndex === -1) return;

    const updatedDays = [...days];

    const items = Array.from(updatedDays[dayIndex].activities);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    updatedDays[dayIndex].activities = items;

    setDays(updatedDays);
  };

  const handleTimeChange = (dayNumber, activityIndex, newTime) => {
    const updatedDays = [...days];

    const day = updatedDays.find((d) => d.day === dayNumber);

    if (!day) return;

    day.activities[activityIndex].time = newTime;

    // SORT LẠI THEO GIỜ
    day.activities.sort((a, b) => a.time.localeCompare(b.time));

    setDays(updatedDays);
  };

  const getBadge = (type) => {
    switch (type) {
      case "food":
        return <span className="badge badge-warning">🍜 Food</span>;

      case "beach":
        return <span className="badge badge-info">🌊 Beach</span>;

      case "cafe":
        return <span className="badge badge-dark">☕ Cafe</span>;

      default:
        return <span className="badge badge-primary">📍 Place</span>;
    }
  };

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
          <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
            <div className="col-md-9 ftco-animate text-center">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <Link to="/">Trang chủ</Link>
                </span>

                <span>Lộ trình tự túc</span>
              </p>

              <h1 className="mb-3 bread">Travel Planner</h1>

              <p className="caps">
                Thiết kế chuyến đi cá nhân hóa theo phong cách của bạn
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
              {/* OVERVIEW */}
              <div className="sidebar-wrap bg-light ftco-animate">
                <h3 className="heading mb-4">Tổng quan</h3>

                <div className="mb-3">
                  <strong>📍 Đà Nẵng - Hội An</strong>
                </div>

                <div className="mb-3">🗓️ {days.length} ngày</div>

                <div className="mb-3">📌 {totalActivities} hoạt động</div>

                <div className="mb-4">💰 4.500.000đ</div>

                {/* PROGRESS */}
                <div className="mb-2 d-flex justify-content-between">
                  <small>Tiến độ kế hoạch</small>

                  <small>75%</small>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#ddd",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "75%",
                      height: "100%",
                      background: "#007bff",
                    }}
                  ></div>
                </div>

                <hr />

                <button className="btn btn-primary btn-block mb-3">
                  💾 Lưu lịch trình
                </button>

                <button className="btn btn-outline-primary btn-block">
                  🤖 AI gợi ý
                </button>
              </div>

              {/* QUICK ACTION */}
              <div className="sidebar-wrap bg-light ftco-animate">
                <h3 className="heading mb-4">Thêm nhanh</h3>

                <div className="row">
                  <div className="col-6 mb-3">
                    <button className="btn btn-light btn-block">🍜 Food</button>
                  </div>

                  <div className="col-6 mb-3">
                    <button className="btn btn-light btn-block">☕ Cafe</button>
                  </div>

                  <div className="col-6">
                    <button className="btn btn-light btn-block">
                      🏨 Hotel
                    </button>
                  </div>

                  <div className="col-6">
                    <button className="btn btn-light btn-block">
                      📍 Place
                    </button>
                  </div>
                </div>
              </div>

              {/* SMART INFO */}
              <div className="sidebar-wrap bg-light ftco-animate">
                <h3 className="heading mb-4">Smart Info</h3>

                <p>☀️ 29°C - Trời đẹp</p>

                <p>🚗 Bà Nà → Mỹ Khê: 45 phút</p>

                <p>⚠️ Day 2 hơi dày lịch</p>

                <p className="mb-0">🌅 Sunset: 17:34</p>
              </div>
            </div>

            {/* MAIN */}
            <div className="col-lg-9">
              {/* TOP BAR */}
              <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
                <div>
                  <h2
                    style={{
                      fontWeight: "700",
                    }}
                  >
                    Kế hoạch chuyến đi
                  </h2>

                  <p className="text-muted mb-0">
                    Kéo thả để sắp xếp lịch trình
                  </p>
                </div>

                <div className="mt-3 mt-lg-0">
                  <button className="btn btn-outline-primary mr-2">
                    🗺️ Map
                  </button>

                  <button className="btn btn-outline-primary mr-2">
                    📊 Budget
                  </button>

                  <button className="btn btn-primary">+ Add</button>
                </div>
              </div>

              {/* TABS */}
              <div className="mb-5">
                <button
                  className={`btn mr-2 ${
                    activeTab === "timeline" ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("timeline")}
                >
                  Timeline
                </button>

                <button
                  className={`btn mr-2 ${
                    activeTab === "map" ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("map")}
                >
                  Map
                </button>

                <button
                  className={`btn ${
                    activeTab === "budget" ? "btn-primary" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("budget")}
                >
                  Budget
                </button>
              </div>

              {/* MAP PLACEHOLDER */}
              {activeTab === "map" && (
                <div
                  className="p-5 text-center bg-light mb-5"
                  style={{
                    borderRadius: "15px",
                  }}
                >
                  <h3>🗺️ Google Map</h3>

                  <p className="mb-0">Sau này tích hợp Google Maps API</p>
                </div>
              )}

              {/* BUDGET */}
              {activeTab === "budget" && (
                <div
                  className="bg-light p-5 mb-5"
                  style={{
                    borderRadius: "15px",
                  }}
                >
                  <h3 className="mb-4">Chi phí chuyến đi</h3>

                  <div className="d-flex justify-content-between mb-3">
                    <span>🏨 Khách sạn</span>

                    <strong>2.000.000đ</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>🍜 Ăn uống</span>

                    <strong>1.000.000đ</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>🚗 Di chuyển</span>

                    <strong>800.000đ</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <strong>Tổng</strong>

                    <strong>4.500.000đ</strong>
                  </div>
                </div>
              )}

              {/* TIMELINE */}
              {activeTab === "timeline" && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  {days.map((dayItem) => (
                    <div key={dayItem.day} className="mb-5">
                      {/* DAY HEADER */}
                      <div
                        className="p-4 mb-4 bg-light"
                        style={{
                          borderRadius: "12px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                          <div>
                            <h3 className="mb-1">Day {dayItem.day}</h3>

                            <p className="mb-2 text-muted">{dayItem.title}</p>

                            <div
                              style={{
                                width: "200px",
                                height: "6px",
                                background: "#ddd",
                                borderRadius: "20px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${dayItem.progress}%`,
                                  height: "100%",
                                  background: "#28a745",
                                }}
                              ></div>
                            </div>
                          </div>

                          <button className="btn btn-outline-primary mt-3 mt-lg-0">
                            + Thêm hoạt động
                          </button>
                        </div>
                      </div>

                      {/* ACTIVITIES */}
                      <Droppable droppableId={dayItem.day.toString()}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {dayItem.activities.map((activity, index) => (
                              <Draggable
                                key={`${dayItem.day}-${index}`}
                                draggableId={`${dayItem.day}-${index}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="destination-list d-md-flex text-center text-lg-left mb-4"
                                  >
                                    {/* TIME */}
                                    <div
                                      className="one"
                                      style={{
                                        minWidth: "130px",
                                      }}
                                    >
                                      <span
                                        className="price"
                                        style={{
                                          fontSize: "20px",
                                          fontWeight: "700",
                                        }}
                                      >
                                        <input
                                          type="time"
                                          value={activity.time}
                                          onChange={(e) =>
                                            handleTimeChange(
                                              dayItem.day,
                                              index,
                                              e.target.value,
                                            )
                                          }
                                          style={{
                                            border: "none",
                                            background: "transparent",
                                            fontSize: "20px",
                                            fontWeight: "700",
                                            width: "110px",
                                          }}
                                        />
                                      </span>
                                    </div>

                                    {/* CARD */}
                                    <div
                                      className="two p-4"
                                      style={{
                                        width: "100%",
                                        background: "#fff",
                                        borderRadius: "12px",
                                        boxShadow:
                                          "0 5px 20px rgba(0,0,0,0.06)",
                                        borderLeft: "4px solid #007bff",
                                        cursor: "grab",
                                      }}
                                    >
                                      <div className="d-flex justify-content-between flex-wrap">
                                        <div>
                                          <h3>{activity.name}</h3>

                                          <p className="rate">
                                            <i className="icon-map-o"></i>{" "}
                                            {activity.location}
                                          </p>
                                        </div>

                                        <div>{getBadge(activity.type)}</div>
                                      </div>

                                      <p>
                                        Kéo thả để thay đổi thứ tự lịch trình.
                                      </p>

                                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="mb-2">
                                          <button className="btn btn-outline-primary btn-sm mr-2">
                                            Chi tiết
                                          </button>

                                          <button className="btn btn-light btn-sm mr-2">
                                            Sửa
                                          </button>

                                          <button className="btn btn-danger btn-sm">
                                            Xóa
                                          </button>
                                        </div>

                                        <small className="text-muted">
                                          🚗 15 phút đến điểm tiếp theo
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Itinerary;
