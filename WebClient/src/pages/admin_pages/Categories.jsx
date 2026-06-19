import React from 'react';
import { categories } from '../../data/usecaseData';

const Categories = () => {
    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Danh muc dich vu</h1>
                <span className="btn btn-sm btn-primary shadow-sm">DANH_MUC_DICH_VU</span>
            </div>

            <div className="row">
                {categories.map((category) => (
                    <div className="col-xl-3 col-md-6 mb-4" key={category.id}>
                        <div className="card shadow h-100 py-2">
                            <div className="card-body">
                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{category.code}</div>
                                <div className="h5 mb-0 font-weight-bold text-gray-800">{category.name}</div>
                                <div className="small text-muted mt-2">{category.items} ban ghi dang hien thi</div>
                                <span className="badge badge-success mt-3">{category.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card shadow">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Bang danh muc</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ma</th>
                                    <th>Ten danh muc</th>
                                    <th>So ban ghi</th>
                                    <th>Trang thai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.code}</td>
                                        <td>{category.name}</td>
                                        <td>{category.items}</td>
                                        <td><span className="badge badge-success">{category.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
