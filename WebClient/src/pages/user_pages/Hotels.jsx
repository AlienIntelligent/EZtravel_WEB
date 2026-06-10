import React from 'react';
import { Link } from 'react-router-dom';

const Hotels = () => {
    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/images/bg_5.jpg")', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax=" properties: { translateY: '70%' }">
                            <p className="breadcrumbs"><span className="mr-2"><Link to="/">Trang chủ</Link></span> <span>Nơi Ở</span></p>
                            <h1 className="mb-3 bread">Khách Sạn & Homestay</h1>
                            <p className="mb-0">Từ hostel giá rẻ đến homestay view đẹp - Phù hợp mọi ngân sách</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Tìm nơi ở</h3>
                                <form action="#">
                                    <div className="fields">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Bạn muốn ở đâu?" />
                                        </div>
                                        <div className="form-group">
                                            <div className="select-wrap one-third">
                                                <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                                <select name="" id="" className="form-control">
                                                    <option value="">Chọn khu vực</option>
                                                    <option value="">Đà Nẵng</option>
                                                    <option value="">Phú Quốc</option>
                                                    <option value="">Hà Giang</option>
                                                    <option value="">Đà Lạt</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="checkin_date" className="form-control" placeholder="Ngày nhận phòng" />
                                        </div>
                                        <div className="form-group">
                                            <input type="text" id="checkout_date" className="form-control" placeholder="Ngày trả phòng" />
                                        </div>
                                        <div className="form-group">
                                            <div className="range-slider">
                                                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Giá mỗi đêm (VNĐ)</p>
                                                <span>
                                                    <input type="number" defaultValue="200000" min="0" max="10000000" /> -
                                                    <input type="number" defaultValue="2000000" min="0" max="10000000" />
                                                </span>
                                                <input defaultValue="200000" min="0" max="10000000" step="100000" type="range" />
                                                <input defaultValue="2000000" min="0" max="10000000" step="100000" type="range" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" value="Tìm kiếm" className="btn btn-primary py-3 px-5" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Hạng sao</h3>
                                <form method="post" className="star-rating">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div className="form-check" key={star}>
                                            <input type="checkbox" className="form-check-input" id={`exampleCheck${star}`} />
                                            <label className="form-check-label" htmlFor={`exampleCheck${star}`}>
                                                <p className="rate">
                                                    <span>
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={i < star ? "icon-star" : "icon-star-o"}></i>
                                                        ))}
                                                    </span>
                                                </p>
                                            </label>
                                        </div>
                                    ))}
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div className="col-md-4 ftco-animate" key={i}>
                                        <div className="destination">
                                            <Link to="/hotel-single" className="img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(/images/hotel-${i}.jpg)` }}>
                                                <div className="icon d-flex justify-content-center align-items-center">
                                                    <span className="icon-search2"></span>
                                                </div>
                                            </Link>
                                            <div className="text p-3">
                                                <div className="d-flex">
                                                    <div className="one">
                                                        <h3><Link to="/hotel-single">Homestay {i}</Link></h3>
                                                        <p className="rate">
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star-o"></i>
                                                            <span>8 Đánh giá</span>
                                                        </p>
                                                    </div>
                                                    <div className="two">
                                                        <span className="price per-price">450k<br /><small>/đêm</small></span>
                                                    </div>
                                                </div>
                                                <p>Không gian ấm cúng, đầy đủ tiện nghi cho phượt thủ.</p>
                                                <hr />
                                                <p className="bottom-area d-flex">
                                                    <span><i className="icon-map-o"></i> Việt Nam</span>
                                                    <span className="ml-auto"><a href="#">Đặt phòng</a></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row mt-5">
                                <div className="col text-center">
                                    <div className="block-27">
                                        <ul>
                                            <li><a href="#">&lt;</a></li>
                                            <li className="active"><span>1</span></li>
                                            <li><a href="#">2</a></li>
                                            <li><a href="#">3</a></li>
                                            <li><a href="#">4</a></li>
                                            <li><a href="#">5</a></li>
                                            <li><a href="#">&gt;</a></li>
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
};

export default Hotels;
