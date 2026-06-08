"use client";

import { usePathname } from "next/navigation";
import TopHeader from "./topHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useEffect } from "react";
import { enablePasswordToggle } from "@/helpers/client/function";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPath = ["/login", "/register", "/reset-password", "verify-email"];
  const auth = useSelector((state: RootState) => state.auth);

    const isPublicPath = publicPath.some(
        (page) => pathname.startsWith(page) || pathname.endsWith(page)
    );
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(err =>
      console.error("Bootstrap JS failed to load", err)
    );
  }, []);

  useEffect(() => {
    enablePasswordToggle();
  }, []);


  if (!isPublicPath) {
    return (
      <div className={`h-100 `}>
        <TopHeader />
        <main className={`main-content container-fluid py-4`}>
          {children}
        </main>
      </div>
    );
  } else {
    return (
      <div className="overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    );
  }

}
