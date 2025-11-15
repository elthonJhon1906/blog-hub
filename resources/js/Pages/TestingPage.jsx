import React from "react";
import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function TestingPage() {
    return (
        <div className="h-[1000px] bg-black">
            <h1>This is a Testing Page</h1>
        </div>
    );
}

TestingPage.layout = (page) => <GuestLayout children={page} />;
