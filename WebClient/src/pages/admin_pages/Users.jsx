import React, { useMemo, useState } from 'react';
import { users } from '../../data/usecaseData';

const Users = () => {
    const [keyword, setKeyword] = useState('');
    const [role, setRole] = useState('');
    const roles = [...new Set(users.map((user) => user.role))];

    const filteredUsers = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return users.filter((user) => {
            const matchKeyword =
                !normalizedKeyword ||
                user.fullName.toLowerCase().includes(normalizedKeyword) ||
                user.email.toLowerCase().includes(normalizedKeyword) ||
                user.phone.includes(normalizedKeyword);
            const matchRole = !role || user.role === role;

            return matchKeyword && matchRole;
        });
    }, [keyword, role]);

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Quan ly nguoi dung</h1>
                <span className="btn btn-sm btn-primary shadow-sm">UC020</span>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <div className="row">
                        <div className="col-md-8">
                            <input
                                className="form-control"
                                placeholder="Tim ten, email, so dien thoai..."
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select className="form-control" value={role} onChange={(event) => setRole(event.target.value)}>
                                <option value="">Tat ca vai tro</option>
                                {roles.map((item) => (
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
                                    <th>ID</th>
                                    <th>Ho ten</th>
                                    <th>Email</th>
                                    <th>SDT</th>
                                    <th>Vai tro</th>
                                    <th>Trang thai</th>
                                    <th>Thao tac</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td><span className="badge badge-primary">{user.role}</span></td>
                                        <td><span className="badge badge-success">{user.status}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary mr-2" type="button">Phan quyen</button>
                                            <button className="btn btn-sm btn-outline-danger" type="button">Khoa</button>
                                        </td>
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

export default Users;
