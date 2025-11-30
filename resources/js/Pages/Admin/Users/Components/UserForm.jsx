import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function UserForm({ user = null, roles = [], isOpen, onClose }) {
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        role_id: user?.role_id || "",
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                username: user.username,
                email: user.email,
                password: "",
                password_confirmation: "",
                role_id: user.role_id,
            });
        } else {
            reset();
        }
    }, [user, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route("admin.users.update", user.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        } else {
            post(route("admin.users.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-2xl">
                            {isEditing ? "Edit User" : "Create New User"}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="btn btn-sm btn-circle btn-ghost"
                            type="button"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Full Name
                                        <span className="text-error ml-1">
                                            *
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className={`input input-bordered w-full ${
                                        errors.name ? "input-error" : ""
                                    }`}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.name}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Username */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Username
                                        <span className="text-error ml-1">
                                            *
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="johndoe"
                                    className={`input input-bordered w-full ${
                                        errors.username ? "input-error" : ""
                                    }`}
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                />
                                {errors.username && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.username}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Email Address
                                        <span className="text-error ml-1">
                                            *
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className={`input input-bordered w-full ${
                                        errors.email ? "input-error" : ""
                                    }`}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.email}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Role */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Role
                                        <span className="text-error ml-1">
                                            *
                                        </span>
                                    </span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${
                                        errors.role_id ? "select-error" : ""
                                    }`}
                                    value={data.role_id}
                                    onChange={(e) =>
                                        setData("role_id", e.target.value)
                                    }
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.role_id}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="divider my-2"></div>

                            {/* Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Password
                                        {!isEditing && (
                                            <span className="text-error ml-1">
                                                *
                                            </span>
                                        )}
                                    </span>
                                    {isEditing && (
                                        <span className="label-text-alt text-gray-500">
                                            Leave blank to keep current password
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    placeholder={
                                        isEditing
                                            ? "Enter new password (optional)"
                                            : "Enter password"
                                    }
                                    className={`input input-bordered w-full ${
                                        errors.password ? "input-error" : ""
                                    }`}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.password}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Confirm Password
                                        {!isEditing && (
                                            <span className="text-error ml-1">
                                                *
                                            </span>
                                        )}
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    className={`input input-bordered w-full ${
                                        errors.password_confirmation
                                            ? "input-error"
                                            : ""
                                    }`}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.password_confirmation && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.password_confirmation}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn btn-ghost"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {isEditing
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : isEditing ? (
                                    "Update User"
                                ) : (
                                    "Create User"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="modal-backdrop" onClick={handleClose}></div>
            </div>
        </>
    );
}
