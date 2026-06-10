import React from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
    return (
        <>
            <div
                className="hero-wrap js-fullheight"
                style={{ backgroundImage: 'url("/images/bg_4.jpg")', minHeight: '100vh' }}
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
                                <span>Kinh Nghiệm</span>
                            </p>
                            <h1 className="mb-3 bread">Kinh Nghiệm Du Lịch Tự Túc</h1>
                            <p className="mb-0">
                                Tips thực tế • Lưu ý quan trọng • Chia sẻ từ người đi trước
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row d-flex">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div className="col-md-3 d-flex ftco-animate" key={i}>
                                <div className="blog-entry align-self-stretch">
                                    <Link
                                        to="/blog-single"
                                        className="block-20"
                                        style={{ backgroundImage: `url("/images/image_${i}.jpg")` }}
                                    >
                                    </Link>
                                    <div className="text p-4 d-block">
                                        <span className="tag">Kinh nghiệm, Du lịch</span>
                                        <h3 className="heading mt-3">
                                            <Link to="/blog-single">
                                                {i === 1 ? "Top 8 Homestay Hội An đẹp và rẻ nhất 2026" :
                                                 i === 2 ? "Kinh nghiệm đi Sapa tự túc: Phương tiện, chỗ ở, lịch trình" :
                                                 i === 3 ? "Cách tiết kiệm chi phí khi du lịch Phú Quốc tự túc" :
                                                 i === 4 ? "Những lưu ý quan trọng khi đi Đà Lạt bằng xe máy" :
                                                 "Chia sẻ kinh nghiệm du lịch tự túc mới nhất"}
                                            </Link>
                                        </h3>
                                        <div className="meta mb-3">
                                            <div><a href="#">May 5, 2026</a></div>
                                            <div><a href="#">Admin</a></div>
                                            <div>
                                                <a href="#" className="meta-chat">
                                                    <span className="icon-chat"></span> 3
                                                </a>
                                            </div>
                                        </div>
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
            </section>
        </>
    );
};

export default Blogs;
