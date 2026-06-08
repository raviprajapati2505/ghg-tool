
import Link from "next/link";
import React from "react";

function CardBox({ title, link }: { title: any, link: any }) {
    return (
        <div className="col-lg-3 col-md-4 col-sm-6 p-2" >
            <div className="bg-white rounded-3 shadow p-3 w-full">
                <div className="card-title mb-4 d-flex justify-content-center fw-bold">{title}</div>
                <div className="d-flex justify-content-center">
                    <Link href={link} className="btn btn-primary btn-sm mb-2 action-button ">
                        <i className="fas fa-eye"></i>{" "} View
                    </Link>
                </div>

            </div>
        </div >
    )
}
export default async function Home() {

    return (
        <div className="row">
            <CardBox title="Categories Management" link="/settings/categories" />

        </div>
    );
}