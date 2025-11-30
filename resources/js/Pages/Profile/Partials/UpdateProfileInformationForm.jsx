import { useState, useRef } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage, router } from "@inertiajs/react";

export default function UpdateProfileInformation({
    user: propUser, // ✅ Terima dari prop
    mustVerifyEmail,
    status,
    className = "",
}) {
    const { auth } = usePage().props;
    const user = propUser || auth.user; // ✅ Gunakan propUser kalau ada, fallback ke auth.user

    const avatarInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user.avatar_url ? `/storage/${user.avatar_url}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
            bio: user.bio || "",
            location: user.location || "",
            link: user.link || "",
            avatar_url: null,
            _method: "PATCH",
        });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("avatar_url", file);

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setData("avatar_url", null);
        setAvatarPreview(
            user.avatar_url ? `/storage/${user.avatar_url}` : null
        );
        if (avatarInputRef.current) {
            avatarInputRef.current.value = "";
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("profile.update"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Redirect ke profile setelah update
                router.visit(route("profile.show", data.username), {
                    only: ["profileUser"], // Refresh hanya data profileUser
                });
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                {/* Avatar Upload */}
                <div>
                    <InputLabel value="Profile Picture" />
                    <div className="mt-2 flex items-center gap-6">
                        {/* Avatar Preview */}
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name
                                            )}&size=200&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center">
                                        <span className="text-3xl font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload Buttons */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                ref={avatarInputRef}
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="btn btn-sm btn-primary"
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
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Choose Photo
                            </button>
                            {data.avatar_url && (
                                <button
                                    type="button"
                                    onClick={removeAvatar}
                                    className="btn btn-sm btn-ghost"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG or GIF. Max size 2MB
                    </p>
                    <InputError className="mt-2" message={errors.avatar_url} />
                </div>

                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Username */}
                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Your profile URL: /@{data.username || "username"}
                    </p>
                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Bio */}
                <div>
                    <InputLabel htmlFor="bio" value="Bio" />
                    <textarea
                        id="bio"
                        className="textarea textarea-bordered mt-1 block w-full min-h-[100px]"
                        value={data.bio}
                        onChange={(e) => setData("bio", e.target.value)}
                        maxLength={500}
                        placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between items-center mt-1">
                        <InputError message={errors.bio} />
                        <p className="text-xs text-gray-500">
                            {data.bio.length}/500
                        </p>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <InputLabel htmlFor="location" value="Location" />
                    <TextInput
                        id="location"
                        className="mt-1 block w-full"
                        value={data.location}
                        onChange={(e) => setData("location", e.target.value)}
                        placeholder="e.g. Jakarta, Indonesia"
                        autoComplete="off"
                    />
                    <InputError className="mt-2" message={errors.location} />
                </div>

                {/* Website/Link */}
                <div>
                    <InputLabel htmlFor="link" value="Website" />
                    <TextInput
                        id="link"
                        type="url"
                        className="mt-1 block w-full"
                        value={data.link}
                        onChange={(e) => setData("link", e.target.value)}
                        placeholder="https://example.com"
                        autoComplete="url"
                    />
                    <InputError className="mt-2" message={errors.link} />
                </div>

                {/* Email Verification */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="alert alert-warning">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <div>
                            <p className="font-medium">
                                Your email address is unverified.
                            </p>
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm hover:text-gray-900"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </div>
                        {status === "verification-link-sent" && (
                            <div className="text-sm font-medium text-green-600">
                                A new verification link has been sent!
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 flex items-center gap-2">
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
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Saved successfully!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
