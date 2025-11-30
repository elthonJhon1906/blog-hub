import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import UserForm from "./Components/UserForm";

export default function Index({ users, roles, filters }) {
    const { flash, auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [deleteUser, setDeleteUser] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users.index"),
            { search, role: roleFilter },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        setRoleFilter("");
        router.get(route("admin.users.index"));
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = (user) => {
        setDeleteUser(user);
    };

    const handleDeleteCancel = () => {
        setDeleteUser(null);
    };

    const handleDelete = () => {
        if (deleteUser) {
            router.delete(route("admin.users.destroy", deleteUser.id), {
                preserveScroll: true,
                onFinish: () => setDeleteUser(null),
            });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Users Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage all users and their roles
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="btn btn-primary gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add New User
                    </button>
                </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="alert alert-success mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="alert alert-error mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Filters */}
            <div className="card bg-base-100 shadow mb-6">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Search Users
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or username..."
                                    className="input input-bordered w-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Role Filter */}
                            <div className="form-control md:w-64">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Filter by Role
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                >
                                    <option value="">All Roles</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn btn-ghost gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Users Table */}
            <div className="card bg-base-100 shadow">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead className="bg-base-200">
                                <tr>
                                    <th className="border-b-2">User</th>
                                    <th className="border-b-2">Username</th>
                                    <th className="border-b-2">Email</th>
                                    <th className="border-b-2">Role</th>
                                    <th className="text-center border-b-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover border-b">
                                            <td className="border-r">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 h-10 rounded-full">
                                                            {user.avatar_url ? (
                                                                <img
                                                                    src={`/storage/${user.avatar_url}`}
                                                                    alt={
                                                                        user.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="bg-primary text-white flex items-center justify-center w-full h-full rounded-full">
                                                                    <span className="text-sm font-semibold">
                                                                        {user.name
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold flex items-center gap-2">
                                                            {user.name}
                                                            {user.id ===
                                                                auth.user
                                                                    .id && (
                                                                <span className="badge badge-info badge-sm">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm opacity-50">
                                                            {new Date(
                                                                user.created_at
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-r">
                                                <span className="badge badge-ghost">
                                                    @{user.username}
                                                </span>
                                            </td>
                                            <td className="text-sm border-r">
                                                {user.email}
                                            </td>
                                            <td className="border-r">
                                                <span
                                                    className={`badge ${
                                                        user.role?.name ===
                                                        "admin"
                                                            ? "badge-error"
                                                            : "badge-primary"
                                                    }`}
                                                >
                                                    {user.role?.name || "N/A"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(user)
                                                        }
                                                        className="btn btn-sm btn-ghost"
                                                        title="Edit"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {user.id ===
                                                    auth.user.id ? (
                                                        <div
                                                            className="tooltip"
                                                            data-tip="Cannot delete your own account"
                                                        >
                                                            <button
                                                                className="btn btn-sm btn-ghost text-gray-400 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteConfirm(
                                                                    user
                                                                )
                                                            }
                                                            className="btn btn-sm btn-ghost text-error"
                                                            title="Delete"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-8"
                                        >
                                            <div className="text-gray-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-12 w-12 mx-auto mb-2 opacity-50"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                    />
                                                </svg>
                                                <p>No users found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {users.from} to {users.to} of{" "}
                                {users.total} users
                            </div>
                            <div className="join">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`join-item btn btn-sm ${
                                            link.active ? "btn-active" : ""
                                        } ${!link.url ? "btn-disabled" : ""}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        preserveState
                                        preserveScroll
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Form Modal */}
            <UserForm
                user={selectedUser}
                roles={roles}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            {deleteUser && (
                <>
                    <input
                        type="checkbox"
                        id="delete-modal"
                        className="modal-toggle"
                        checked={true}
                        readOnly
                    />
                    <div className="modal" role="dialog">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-error">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                Confirm Delete
                            </h3>
                            <p className="py-4">
                                Are you sure you want to delete user{" "}
                                <span className="font-bold">
                                    {deleteUser.name}
                                </span>
                                ?
                                <br />
                                <span className="text-sm text-gray-500">
                                    This action cannot be undone.
                                </span>
                            </p>
                            <div className="modal-action">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-error"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                        <label
                            className="modal-backdrop"
                            onClick={handleDeleteCancel}
                        >
                            Close
                        </label>
                    </div>
                </>
            )}
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
