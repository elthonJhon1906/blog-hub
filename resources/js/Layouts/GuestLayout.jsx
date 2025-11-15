import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";

export default function GuestLayout({ children }) {
    return (
        <div className=" flex flex-col bg-white sm:justify-center sm:pt-0  max-w-screen-2xl mx-auto">
            <NavBar />
            <div className=" max-lg:mt-7 w-full px-40 overflow-hidden py-4 shadow-md  sm:rounded-lg max-lg:px-6">
                {children}
            </div>
            <Footer />
        </div>
    );
}
