import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
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
                            className="col-md-9 text-center ftco-animate"
                            data-scrollax=" properties: { translateY: '70%' }"
                        >
                            <p className="breadcrumbs">
                                <span className="mr-2"><Link to="/">Trang chủ</Link></span>
                                <span>Về Chúng Tôi</span>
                            </p>
                            <h1 className="mb-3 bread">Về EZtravel</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section">
                <div className="container">
                    <div className="row d-md-flex">
                        <div
                            className="col-md-6 ftco-animate img about-image"
                            style={{ backgroundImage: 'url("/images/about.jpg")' }}
                        ></div>
                        <div className="col-md-6 ftco-animate p-md-5">
                            <div className="row">
                                <div className="col-md-12 nav-link-wrap mb-5">
                                    <div
                                        className="nav ftco-animate nav-pills"
                                        id="v-pills-tab"
                                        role="tablist"
                                        aria-orientation="vertical"
                                    >
                                        <a
                                            className="nav-link active"
                                            id="v-pills-whatwedo-tab"
                                            data-toggle="pill"
                                            href="#v-pills-whatwedo"
                                            role="tab"
                                            aria-controls="v-pills-whatwedo"
                                            aria-selected="true"
                                        >Chúng tôi làm gì?</a>

                                        <a
                                            className="nav-link"
                                            id="v-pills-mission-tab"
                                            data-toggle="pill"
                                            href="#v-pills-mission"
                                            role="tab"
                                            aria-controls="v-pills-mission"
                                            aria-selected="false"
                                        >Sứ mệnh</a>

                                        <a
                                            className="nav-link"
                                            id="v-pills-goal-tab"
                                            data-toggle="pill"
                                            href="#v-pills-goal"
                                            role="tab"
                                            aria-controls="v-pills-goal"
                                            aria-selected="false"
                                        >Mục tiêu</a>
                                    </div>
                                </div>
                                <div className="col-md-12 d-flex align-items-center">
                                    <div className="tab-content ftco-animate" id="v-pills-tabContent">
                                        <div
                                            className="tab-pane fade show active"
                                            id="v-pills-whatwedo"
                                            role="tabpanel"
                                            aria-labelledby="v-pills-whatwedo-tab"
                                        >
                                            <div>
                                                <h2 className="mb-4">Hỗ trợ du lịch tự túc Việt Nam</h2>
                                                <p>
                                                    Chúng tôi cung cấp nền tảng tìm kiếm và chia sẻ thông tin du lịch tự túc toàn diện nhất.
                                                </p>
                                                <p>
                                                    Từ việc gợi ý lộ trình, tìm kiếm điểm đến hấp dẫn đến việc đặt chỗ ở và chia sẻ kinh nghiệm thực tế. EZtravel giúp bạn tối ưu hóa chi phí và thời gian để tận hưởng chuyến đi theo cách riêng của mình.
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="v-pills-mission"
                                            role="tabpanel"
                                            aria-labelledby="v-pills-mission-tab"
                                        >
                                            <div>
                                                <h2 className="mb-4">EZtravel - Người bạn đồng hành trên mọi cung đường.</h2>
                                                <p>
                                                    Sứ mệnh của chúng tôi là truyền cảm hứng và tiếp sức cho cộng đồng yêu du lịch tự túc tại Việt Nam.
                                                </p>
                                                <p>
                                                    Chúng tôi tin rằng mỗi chuyến đi là một hành trình khám phá bản thân, và EZtravel có mặt ở đây để đảm bảo hành trình đó trở nên đơn giản, an toàn và tràn đầy niềm vui.
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="tab-pane fade"
                                            id="v-pills-goal"
                                            role="tabpanel"
                                            aria-labelledby="v-pills-goal-tab"
                                        >
                                            <div>
                                                <h2 className="mb-4">Giải pháp thông minh cho những chuyến đi tự do.</h2>
                                                <p>
                                                    Trở thành hệ sinh thái du lịch tự túc số 1 tại Việt Nam, nơi kết nối hàng triệu du khách và các nhà cung cấp dịch vụ địa phương uy tín.
                                                </p>
                                                <p>
                                                    Chúng tôi không ngừng cải tiến công nghệ để mang đến những trải nghiệm cá nhân hóa, giúp bất kỳ ai cũng có thể tự tin xách ba lô lên và đi.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Hỏi đáp</span>
                            <h2 className="mb-4"><strong>Câu hỏi</strong> thường gặp</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 ftco-animate">
                            <div id="accordion">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menuone"
                                                    aria-expanded="true"
                                                    aria-controls="menuone"
                                                >Làm thế nào để đặt lộ trình?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menuone" className="collapse show">
                                                <div className="card-body">
                                                    <p>
                                                        Bạn chỉ cần chọn lộ trình mong muốn, kiểm tra thông tin chi tiết và nhấn nút "Đặt ngay". Chúng tôi sẽ gửi xác nhận qua email của bạn.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menutwo"
                                                    aria-expanded="false"
                                                    aria-controls="menutwo"
                                                >Tôi có thể thay đổi lộ trình không?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menutwo" className="collapse">
                                                <div className="card-body">
                                                    <p>
                                                        Hoàn toàn có thể. ezTravel cung cấp các lộ trình linh hoạt để bạn có thể tùy chỉnh theo thời gian và sở thích cá nhân.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menu3"
                                                    aria-expanded="false"
                                                    aria-controls="menu3"
                                                >
                                                    Thanh toán như thế nào?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menu3" className="collapse">
                                                <div className="card-body">
                                                    <p>
                                                        Chúng tôi hỗ trợ nhiều hình thức thanh toán: Chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay) và thẻ quốc tế.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menu4"
                                                    aria-expanded="false"
                                                    aria-controls="menu4"
                                                >Có hỗ trợ hướng dẫn viên không?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menu4" className="collapse">
                                                <div className="card-body">
                                                    <p>
                                                        ezTravel tập trung vào du lịch tự túc, nhưng chúng tôi có thể kết nối bạn với các hướng dẫn viên địa phương nếu bạn có yêu cầu.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menu5"
                                                    aria-expanded="false"
                                                    aria-controls="menu5"
                                                >Làm sao để liên hệ hỗ trợ?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menu5" className="collapse">
                                                <div className="card-body">
                                                    <p>
                                                        Bạn có thể gửi tin nhắn qua fanpage, gọi hotline hoặc gửi email trực tiếp cho chúng tôi. Đội ngũ hỗ trợ hoạt động 24/7.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card">
                                            <div className="card-header">
                                                <a
                                                    className="card-link"
                                                    data-toggle="collapse"
                                                    href="#menu6"
                                                    aria-expanded="false"
                                                    aria-controls="menu6"
                                                >Quy định về hoàn tiền?
                                                    <span className="collapsed"
                                                    ><i className="icon-plus-circle"></i></span
                                                    ><span className="expanded"
                                                    ><i className="icon-minus-circle"></i></span
                                                    ></a>
                                            </div>
                                            <div id="menu6" className="collapse">
                                                <div className="card-body">
                                                    <p>
                                                        Chính sách hoàn tiền phụ thuộc vào từng dịch vụ cụ thể. Thông tin này sẽ được hiển thị rõ ràng trong quá trình đặt chỗ.
                                                    </p>
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

export default About;
