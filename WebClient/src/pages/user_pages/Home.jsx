import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div
                className="hero-wrap js-fullheight"
                style={{ backgroundImage: 'url("/images/bg_1.jpg")', minHeight: '100vh' }}
            >
                <div className="overlay"></div>
                <div className="container">
                    <div
                        className="row no-gutters slider-text js-fullheight align-items-center justify-content-start"
                        data-scrollax-parent="true"
                    >
                        <div
                            className="col-md-9 ftco-animate"
                            data-scrollax=" properties: { translateY: '70%' }"
                        >
                            <h1
                                className="mb-4"
                                data-scrollax="properties: { translateY: '30%', opacity: 1.6 }"
                            >
                                <strong>Khám Phá Việt Nam</strong><br />Theo cách của bạn
                            </h1>
                            <p data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">
                                Lộ trình tự túc chi tiết • Homestay đẹp • Tips thực tế từ người đi trước
                            </p>

                            <div className="block-17 my-4">
                                <form action="#" method="post" className="d-block d-flex">
                                    <div className="fields d-block d-flex">
                                        <div className="textfield-search one-third">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Bạn muốn đi đâu? (Đà Nẵng, Phú Quốc...)"
                                            />
                                        </div>
                                        <div className="select-wrap one-third">
                                            <div className="icon">
                                                <span className="ion-ios-arrow-down"></span>
                                            </div>
                                            <select className="form-control" style={{ color: '#000' }}>
                                                <option value="">Thời gian</option>
                                                <option value="">2-3 ngày</option>
                                                <option value="">4-5 ngày</option>
                                                <option value="">7 ngày</option>
                                                <option value="">10+ ngày</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input
                                        type="submit"
                                        className="search-submit btn btn-primary"
                                        value="Tìm kiếm"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section services-section bg-light">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center">
                                    <div className="icon"><span className="flaticon-guarantee"></span></div>
                                </div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">Đảm bảo giá tốt</h3>
                                    <p>Cam kết mức giá cạnh tranh nhất cho mọi dịch vụ đặt chỗ.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center">
                                    <div className="icon"><span className="flaticon-like"></span></div>
                                </div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">Khách hàng tin tưởng</h3>
                                    <p>Cộng đồng hàng ngàn người dùng chia sẻ kinh nghiệm thực tế.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center">
                                    <div className="icon"><span className="flaticon-detective"></span></div>
                                </div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">Đại lý tận tâm</h3>
                                    <p>Đội ngũ hỗ trợ nhiệt tình, giải đáp mọi thắc mắc 24/7.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex align-self-stretch ftco-animate">
                            <div className="media block-6 services d-block text-center">
                                <div className="d-flex justify-content-center">
                                    <div className="icon"><span className="flaticon-support"></span></div>
                                </div>
                                <div className="media-body p-2 mt-2">
                                    <h3 className="heading mb-3">Hỗ trợ 24/7</h3>
                                    <p>Luôn đồng hành cùng bạn trên mọi nẻo đường khám phá.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section ftco-destination">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Vẻ đẹp tự nhiên</span>
                            <h2 className="mb-4"><strong>Điểm đến</strong> nổi bật</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="destination-slider owl-carousel ftco-animate">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div className="item" key={i}>
                                        <div className="destination">
                                            <a
                                                href="#"
                                                className="img d-flex justify-content-center align-items-center"
                                                style={{ backgroundImage: `url(/images/destination-${i}.jpg)` }}
                                            >
                                                <div className="icon d-flex justify-content-center align-items-center">
                                                    <span className="icon-search2"></span>
                                                </div>
                                            </a>
                                            <div className="text p-3">
                                                <h3><a href="#">{i === 1 ? "Paris, Italy" : i === 2 ? "San Francisco, USA" : i === 3 ? "London, UK" : "Destination"}</a></h3>
                                                <span className="listing">15 Listing</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Lộ trình phổ biến</span>
                            <h2 className="mb-4"><strong>Lộ trình</strong> tự túc hàng đầu</h2>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row destination-slider owl-carousel">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div className="item" key={i}>
                                <div className="destination">
                                    <a
                                        href="#"
                                        className="img img-2 d-flex justify-content-center align-items-center"
                                        style={{ backgroundImage: `url(/images/destination-${i}.jpg)` }}
                                    >
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <span className="icon-search2"></span>
                                        </div>
                                    </a>
                                    <div className="text p-3">
                                        <div className="d-flex">
                                            <div className="one">
                                                <h3><a href="#">Lộ trình {i}</a></h3>
                                                <p className="rate">
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star-o"></i>
                                                    <span>8 Rating</span>
                                                </p>
                                            </div>
                                            <div className="two">
                                                <span className="price">$200</span>
                                            </div>
                                        </div>
                                        <p>Chia sẻ kinh nghiệm du lịch tự túc từ cộng đồng.</p>
                                        <p className="days"><span>2 days 3 nights</span></p>
                                        <hr />
                                        <p className="bottom-area d-flex">
                                            <span><i className="icon-map-o"></i> Việt Nam</span>
                                            <span className="ml-auto"><a href="#">Khám phá</a></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="ftco-section ftco-counter img"
                id="section-counter"
                style={{ backgroundImage: 'url("/images/bg_1.jpg")' }}
            >
                <div className="container">
                    <div className="row justify-content-center mb-5 pb-3">
                        <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
                            <h2 className="mb-4">Thống kê ấn tượng</h2>
                            <span className="subheading">Hơn 100,000 khách hàng hài lòng</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="row">
                                <div className="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                                    <div className="block-18 text-center">
                                        <div className="text">
                                            <strong className="number" data-number="100000">0</strong>
                                            <span>Khách hàng</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                                    <div className="block-18 text-center">
                                        <div className="text">
                                            <strong className="number" data-number="40000">0</strong>
                                            <span>Điểm đến</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                                    <div className="block-18 text-center">
                                        <div className="text">
                                            <strong className="number" data-number="87000">0</strong>
                                            <span>Khách sạn</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex justify-content-center counter-wrap ftco-animate">
                                    <div className="block-18 text-center">
                                        <div className="text">
                                            <strong className="number" data-number="56400">0</strong>
                                            <span>Nhà hàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Ưu đãi đặc biệt</span>
                            <h2 className="mb-4"><strong>Khách sạn</strong> &amp; Chỗ ở phổ biến</h2>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row destination-slider owl-carousel">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div className="item" key={i}>
                                <div className="destination">
                                    <a
                                        href="#"
                                        className="img img-2 d-flex justify-content-center align-items-center"
                                        style={{ backgroundImage: `url(/images/hotel-${i}.jpg)` }}
                                    >
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <span className="icon-search2"></span>
                                        </div>
                                    </a>
                                    <div className="text p-3">
                                        <div className="d-flex">
                                            <div className="one">
                                                <h3><a href="#">Khách sạn {i}</a></h3>
                                                <p className="rate">
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star"></i>
                                                    <i className="icon-star-o"></i>
                                                    <span>8 Rating</span>
                                                </p>
                                            </div>
                                            <div className="two">
                                                <span className="price per-price">$40<br /><small>/đêm</small></span>
                                            </div>
                                        </div>
                                        <p>Chỗ ở sạch sẽ, tiện nghi và gần trung tâm.</p>
                                        <hr />
                                        <p className="bottom-area d-flex">
                                            <span><i className="icon-map-o"></i> Việt Nam</span>
                                            <span className="ml-auto"><a href="#">Đặt ngay</a></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section testimony-section bg-light">
                <div className="container">
                    <div className="row justify-content-start">
                        <div className="col-md-8 heading-section ftco-animate">
                            <span className="subheading">Cảm nhận khách hàng</span>
                            <h2 className="mb-4 pb-3"><strong>Trải nghiệm</strong> thực tế</h2>
                        </div>
                    </div>
                    <div className="row ftco-animate">
                        <div className="col-md-12">
                            <div className="carousel-testimony owl-carousel">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div className="item" key={i}>
                                        <div className="testimony-wrap p-4 pb-5">
                                            <div className="user-img mb-5" style={{ backgroundImage: `url(/images/person_${i}.jpg)` }}>
                                                <span className="quote d-flex align-items-center justify-content-center">
                                                    <i className="icon-quote-left"></i>
                                                </span>
                                            </div>
                                            <div className="text">
                                                <p className="mb-5">Chuyến đi tuyệt vời, lộ trình rất chi tiết và dễ đi.</p>
                                                <p className="name">Khách hàng {i}</p>
                                                <span className="position">Phượt thủ</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Ưu đãi đặc biệt</span>
                            <h2 className="mb-4"><strong>Nhà hàng</strong> phổ biến</h2>
                        </div>
                    </div>
                    <div className="row">
                        {[1, 2, 3, 4].map((i) => (
                            <div className="col-md-6 col-lg-3 ftco-animate" key={i}>
                                <div className="destination">
                                    <a
                                        href="#"
                                        className="img img-2 d-flex justify-content-center align-items-center"
                                        style={{ backgroundImage: `url(/images/restaurant-${i}.jpg)` }}
                                    >
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <span className="icon-search2"></span>
                                        </div>
                                    </a>
                                    <div className="text p-3">
                                        <h3><a href="#">Nhà hàng {i}</a></h3>
                                        <p className="rate">
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star-o"></i>
                                            <span>8 Rating</span>
                                        </p>
                                        <p>Ẩm thực địa phương đặc sắc và đa dạng.</p>
                                        <hr />
                                        <p className="bottom-area d-flex">
                                            <span><i className="icon-map-o"></i> Việt Nam</span>
                                            <span className="ml-auto"><a href="#">Khám phá</a></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Tin tức &amp; Bài viết</span>
                            <h2 className="mb-4"><strong>Bài viết</strong> mới nhất</h2>
                        </div>
                    </div>
                    <div className="row d-flex">
                        {[1, 2, 3, 4].map((i) => (
                            <div className="col-md-3 d-flex ftco-animate" key={i}>
                                <div className="blog-entry align-self-stretch">
                                    <a href="blog-single.html" className="block-20" style={{ backgroundImage: `url(/images/image_${i}.jpg)` }}>
                                    </a>
                                    <div className="text p-4 d-block">
                                        <span className="tag">Kinh nghiệm</span>
                                        <h3 className="heading mt-3"><a href="#">8 Cách Tiết Kiệm Chi Phí Khi Du Lịch Tự Túc</a></h3>
                                        <div className="meta mb-3">
                                            <div><a href="#">May 5, 2026</a></div>
                                            <div><a href="#">Admin</a></div>
                                            <div><a href="#" className="meta-chat"><span className="icon-chat"></span> 3</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section-parallax">
                <div className="parallax-img d-flex align-items-center" style={{ background: "linear-gradient(45deg, #2ecc71, #3498db)", padding: "100px 0" }}>
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
                                <h2>Đăng ký nhận tin</h2>
                                <p>Nhận thông báo về các lộ trình mới nhất và ưu đãi đặc biệt từ ezTravel.</p>
                                <div className="row d-flex justify-content-center mt-5">
                                    <div className="col-md-8">
                                        <form action="#" className="subscribe-form">
                                            <div className="form-group d-flex">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Địa chỉ email của bạn"
                                                />
                                                <input
                                                    type="submit"
                                                    value="Đăng ký"
                                                    className="submit px-3"
                                                />
                                            </div>
                                        </form>
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

export default Home;
