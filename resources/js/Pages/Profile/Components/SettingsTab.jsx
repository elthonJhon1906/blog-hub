import { Link } from "@inertiajs/react";
import UpdateProfileInformationForm from "../Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "../Partials/UpdatePasswordForm";
import DeleteUserForm from "../Partials/DeleteUserForm";
import { usePage } from "@inertiajs/react";

export default function SettingsTab() {
    const { profileUser } = usePage().props; // ✅ Pakai profileUser, bukan auth.user!

    return (
        <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Profile Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Update your account's profile information and email
                        address
                    </p>
                </div>
                <UpdateProfileInformationForm
                    user={profileUser} // ✅ Pass profileUser sebagai prop
                    mustVerifyEmail={true}
                    status={null}
                />
            </div>

            {/* Update Password */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Update Password
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Ensure your account is using a long, random password to
                        stay secure
                    </p>
                </div>
                <UpdatePasswordForm />
            </div>

            {/* Delete Account */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Delete Account
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted
                    </p>
                </div>
                <DeleteUserForm />
            </div>
        </div>
    );
}
