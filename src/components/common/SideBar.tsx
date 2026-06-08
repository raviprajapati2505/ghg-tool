'use client';

import { useState } from 'react';

interface SideMenuItem {
    label: string;
    key: string;
    icon?: React.ReactNode;
    children?: SideMenuItem[];
}

interface SideBarProps {
    menu: SideMenuItem[];
    activeKey: string;
    onSelect: (key: string) => void;
}

export default function SideBar({ menu, activeKey, onSelect }: SideBarProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (key: string) => {
        onSelect(key);
        setOpen(false); // close on mobile
    };

    return (
        <>
            {/* Toggle button on top-left, outside sidebar */}
            <div className="display-on-screen fixed top-0 start-0 p-2 z-1050">
                <button
                    className="btn btn-dark"
                    onClick={() => setOpen(true)}
                >
                    ☰ Menu
                </button>
            </div>

            {/* Sidebar */}
            <div className={`sidebar-main-div bg-white shadow ${open ? 'open' : ''}`}>
                {/* Close button (mobile only) */}
                <div className="display-on-screen text-end p-2 close-button">
                    <button
                        className="btn btn-sm btn-light"
                        onClick={() => setOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <ul className="nav nav-pills flex-column p-2">
                    {menu.map((item, index) => {
                        const isParentActive = item.children?.some(
                            c => c.key === activeKey
                        );

                        return (
                            <li className="nav-item" key={index}>

                                {/* Parent without children */}
                                {!item.children ? (
                                    <button
                                        className={`nav-link nav-link-custom text-start ${activeKey === item.key ? 'active-tab' : ''}`}
                                        onClick={() => handleSelect(item.key)}
                                    >
                                        {item.icon && <span className="me-2">{item.icon}</span>}
                                        {item.label}
                                        {activeKey === item.key &&
                                            < span className="float-end">
                                                <i className="fa fa-arrow-left move-right-to-left"></i>
                                            </span>
                                        }
                                    </button>
                                ) : (
                                    <>
                                        {/* Parent with children */}
                                        <button
                                            className={`nav-link nav-link-custom text-start ${isParentActive ? 'active' : ''}`}
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#submenu-${index}`}
                                        >
                                            {item.icon && <span className="me-2">{item.icon}</span>}
                                            {item.label}
                                        </button>

                                        {/* Sub menu */}
                                        <div
                                            id={`submenu-${index}`}
                                            className={`collapse ps-3 ${isParentActive ? 'show' : ''}`}
                                        >
                                            <ul className="nav flex-column">
                                                {item.children.map((sub, subIndex) => (
                                                    <li className="nav-item" key={subIndex}>
                                                        <button
                                                            className={`nav-link nav-link-custom text-start ${activeKey === sub.key ? 'active' : ''}`}
                                                            onClick={() => handleSelect(sub.key)}
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                            </li>
                        );
                    })}
                </ul>
            </div >

            {/* Backdrop */}
            {/* {open && (
                <div
                    className="sidebar-backdrop display-on-screen"
                    onClick={() => setOpen(false)}
                />
            )} */}
        </>
    );
}
