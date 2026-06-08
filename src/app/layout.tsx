import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../scss/style.scss";
import Providers from "@/components/main/providers";
import LayoutContent from "@/components/main/layoutContent";
export const dynamic = "force-dynamic";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
            {/* <link rel="manifest" href="/manifest.json" /> */}
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <title> SUSTAINO-AI QIA GHG INVENTORY </title>
            <body className="flex min-h-screen bg-gray-100">
                <Providers>
                    <LayoutContent>{children}</LayoutContent>
                </Providers>
            </body>
        </html>
    );
}
