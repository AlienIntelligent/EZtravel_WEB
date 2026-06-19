import React, { useMemo, useState } from 'react';
import { destinations, formatCurrency, hotels, restaurants } from '../../data/usecaseData';

const Products = () => {
    const [type, setType] = useState('');
    const rows = [
        ...destinations.map((item) => ({
            id: `place-${item.id}`,
            name: item.name,
            type: 'Dia diem',
            province: item.province,
            price: null,
            rating: item.rating,
            status: 'Active',
        })),
        ...hotels.map((item) => ({
            id: `hotel-${item.id}`,
            name: item.name,
            type: item.type,
            province: item.province,
            price: item.price,
            rating: item.rating,
            status: item.availability,
        })),
        ...restaurants.map((item) => ({
            id: `restaurant-${item.id}`,
            name: item.name,
            type: 'Nha hang',
            province: item.province,
            price: null,
            rating: item.rating,
            status: 'Active',
        })),
    ];

    const types = [...new Set(rows.map((row) => row.type))];
    const filteredRows = useMemo(() => rows.filter((row) => !type || row.type === type), [rows, type]);

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quan ly dia diem & dich vu</h1>
                <span className="btn btn-sm btn-primary shadow-sm">UC022 / UC023</span>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h6 className="m-0 font-weight-bold text-primary">Danh sach hien thi tren user site</h6>
                        </div>
                        <div className="col-md-4">
                            <select className="form-control" value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="">Tat ca loai</option>
                                {types.map((item) => (
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Ten</th>
                                    <th>Loai</th>
                                    <th>Tinh thanh</th>
                                    <th>Gia</th>
                                    <th>Rating</th>
                                    <th>Trang thai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.name}</td>
                                        <td>{row.type}</td>
                                        <td>{row.province}</td>
                                        <td>{row.price ? formatCurrency(row.price) : 'Theo lich trinh'}</td>
                                        <td>{row.rating}/5</td>
                                        <td><span className="badge badge-info">{row.status}</span></td>
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

export default Products;
