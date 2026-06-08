'use client';

import Link from 'next/link';

interface BreadcrumbProps {
    backButtonLink?: string;
    items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items, backButtonLink }: BreadcrumbProps) {
    return (
        <nav className="d-flex" aria-label="Breadcrumb">
            <ol className="list-reset d-flex space-x-1 p-0">
                {items.map((item, index) => (
                    <li key={index} className="d-flex items-center">
                        {item.href ? (
                            <Link href={item.href} className="text-decoration-none hover:font-medium font-semibold" style={{color:"#d30685e0"}}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-800 font-medium">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ol>
            {backButtonLink && (
                <Link href={backButtonLink} className="btn btn-secondary">
                    <i className="	fa fa-arrow-circle-left"></i>{" "}
                    Back
                </Link>
            )}
        </nav>
    );
}
