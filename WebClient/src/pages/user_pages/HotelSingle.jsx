import React from 'react';
import { Link } from 'react-router-dom';

const HotelSingle = () => {
    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/images/bg_5.jpg")', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax=" properties: { translateY: '70%' }">
                            <p className="breadcrumbs" data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">
                                <span className="mr-2"><Link to="/">Trang chủ</Link></span>
                                <span className="mr-2"><Link to="/hotels">Nơi ở</Link></span>
                                <span>Chi tiết</span>
                            </p>
                            <h1 className="mb-3 bread" data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">Thông tin khách sạn</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Tìm nơi ở khác</h3>
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
                                                    <option value="">Đà Lạt</option>
                                                    <option value="">Phú Quốc</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" value="Tìm kiếm" className="btn btn-primary py-3 px-5" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="row">
                                <div className="col-md-12 ftco-animate">
                                    <div className="single-slider">
                                        <div className="item">
                                            <div className="hotel-img" style={{ backgroundImage: 'url("/images/hotel-2.jpg")', height: '500px', backgroundSize: 'cover', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 hotel-single mt-4 mb-5 ftco-animate">
                                    <span>Khách sạn & Homestay tốt nhất</span>
                                    <h2>Luxury Homestay Đà Lạt</h2>
                                    <p className="rate mb-5">
                                        <span className="loc"><a href="#"><i className="icon-map"></i> 123 Đường Khởi Nghĩa Bắc Sơn, Đà Lạt, Lâm Đồng</a></span>
                                        <span className="star">
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star-o"></i>
                                            8 Đánh giá</span>
                                    </p>
                                    <p>Trải nghiệm không gian sống ảo cực chất giữa lòng thành phố ngàn hoa. Homestay được thiết kế theo phong cách tối giản, hiện đại nhưng vẫn mang lại cảm giác ấm cúng cho du khách.</p>
                                    <div className="d-md-flex mt-5 mb-5">
                                        <ul>
                                            <li>Gần trung tâm thành phố (5 phút đi xe)</li>
                                            <li>View thung lũng cực đẹp</li>
                                            <li>Đầy đủ tiện nghi: Wifi, nước nóng, bếp nấu</li>
                                            <li>Chủ nhà nhiệt tình, hỗ trợ thuê xe máy</li>
                                        </ul>
                                        <ul className="ml-md-5">
                                            <li>Không gian yên tĩnh, thoáng mát</li>
                                            <li>Có khu vực BBQ ngoài trời</li>
                                            <li>Giá cả hợp lý cho phượt thủ</li>
                                            <li>Hỗ trợ đặt tour tham quan</li>
                                        </ul>
                                    </div>
                                    <p>Mỗi căn phòng đều có cửa sổ lớn đón ánh nắng tự nhiên và gió trời. Bạn có thể thư giãn với một tách cà phê buổi sáng và ngắm nhìn sương mù bao phủ thung lũng từ ban công phòng mình.</p>
                                </div>
                                <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                    <h4 className="mb-4">Xem Video thực tế</h4>
                                    <div className="block-16">
                                        <figure>
                                            <img src="/images/hotel-6.jpg" alt="Image placeholder" className="img-fluid" style={{ borderRadius: '10px' }} />
                                            <a href="https://vimeo.com/45830194" className="play-button popup-vimeo"><span className="icon-play"></span></a>
                                        </figure>
                                    </div>
                                </div>
                                <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                    <h4 className="mb-4">Các phòng còn trống</h4>
                                    <div className="row">
                                        {[4, 5, 6].map((i) => (
                                            <div className="col-md-4" key={i}>
                                                <div className="destination">
                                                    <a href="#" className="img img-2" style={{ backgroundImage: `url(/images/room-${i}.jpg)` }}></a>
                                                    <div className="text p-3">
                                                        <div className="d-flex">
                                                            <div className="one">
                                                                <h3><a href="#">Phòng Deluxe {i}</a></h3>
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
                                                                <span className="price per-price">500k<br /><small>/đêm</small></span>
                                                            </div>
                                                        </div>
                                                        <p>Phòng rộng rãi, có ban công riêng view thung lũng.</p>
                                                        <hr />
                                                        <p className="bottom-area d-flex">
                                                            <span><i className="icon-map-o"></i> Đà Lạt</span>
                                                            <span className="ml-auto"><a href="#">Đặt ngay</a></span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-12 hotel-single ftco-animate mb-5 mt-4">
                                    <h4 className="mb-5">Kiểm tra phòng & Đặt chỗ</h4>
                                    <div className="fields">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder="Họ và tên" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder="Email" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="text" id="checkin_date" className="form-control" placeholder="Ngày nhận phòng" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="text" id="checkout_date" className="form-control" placeholder="Ngày trả phòng" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="select-wrap one-third">
                                                        <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                                        <select name="" id="" className="form-control">
                                                            <option value="0">Người lớn</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="select-wrap one-third">
                                                        <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                                        <select name="" id="" className="form-control">
                                                            <option value="0">Trẻ em</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <input type="submit" value="Kiểm tra phòng trống" className="btn btn-primary py-3 px-4" />
                                                </div>
                                            </div>
                                        </div>
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

export default HotelSingle;
