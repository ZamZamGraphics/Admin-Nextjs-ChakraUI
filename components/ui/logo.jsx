"use client"
import logoDark from "@/public/logo-dark.svg"
import logoLight from "@/public/logo-light.svg"
import { useColorMode } from "@/components/ui/color-mode"
import Image from "next/image";
import { useEffect, useState } from "react";

function Logo() {
    const { colorMode } = useColorMode();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const logoSrc = colorMode === "light" ? logoLight : logoDark;

    return (
        <Image
            src={logoSrc}
            alt="Al Madina IT"
            priority
            style={{
                width: "200px",
                height: "auto",
                display: "block",
                margin: "auto"
            }}
        />
    );
}

export default Logo;
