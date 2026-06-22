import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <>
            <div
                className="hero-wrap js-fullheight"
                style={{ backgroundImage: 'url("/images/bg_2.jpg")', minHeight: '100vh' }}
            >
                <div className="overlay"></div>
                <div className="container">
                    <div
                        className="row no-gutters slider-text js-fullheight align-items-center justify-content-center"
                        data-scrollax-parent="true"
                    >
                        <div
                            className="col-md-9 ftco-animate text-center"
                            data-scrollax=" properties: { translateY: '70%' }"
                        >
                            <p className="breadcrumbs">
                                <span className="mr-2"><Link to="/">Trang chủ</Link></span>
                                <span>Liên Hệ</span>
                            </p>
                            <h1 className="mb-3 bread">Liên Hệ EZtravel</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section contact-section ftco-degree-bg">
                <div className="container">
                    <div className="row d-flex mb-5 contact-info">
                        <div className="col-md-12 mb-4">
                            <h2 className="h4">Thông tin liên hệ</h2>
                        </div>
                        <div className="w-100"></div>
                        <div className="col-md-3">
                            <p>
                                <span>Địa chỉ:</span> Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội
                            </p>
                        </div>
                        <div className="col-md-3">
                            <p>
                                <span>Điện thoại:</span> <a href="tel://+84123456789">+84 123 456 789</a>
                            </p>
                        </div>
                        <div className="col-md-3">
                            <p>
                                <span>Email:</span>
                                <a href="mailto:info@eztravel.com">info@eztravel.com</a>
                            </p>
                        </div>
                        <div className="col-md-3">
                            <p><span>Website</span> <a href="#">eztravel.com</a></p>
                        </div>
                    </div>
                    <div className="row block-9">
                        <div className="col-md-6 pr-md-5">
                            <form action="#">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Họ và tên"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Chủ đề" />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name=""
                                        id=""
                                        cols="30"
                                        rows="7"
                                        className="form-control"
                                        placeholder="Nội dung lời nhắn"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="submit"
                                        value="Gửi tin nhắn"
                                        className="btn btn-primary py-3 px-5"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6" id="map" style={{ minHeight: '400px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6781640523094!2d105.84277717596853!3d21.005536488580662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac76ccab6dd7%3A0x5507c2350c749c8!2zMSDEkOG6oWkgQ-G7kyBWaeG7h3QsIELDoWNoIEtob2EsIEhhaSBCw6AgVHLGsG5nLCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1714900000000!5m2!1sen!2s" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
