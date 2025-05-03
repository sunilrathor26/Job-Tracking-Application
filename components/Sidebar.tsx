"use client";
import links from "@/utils/links";
import { usePathname } from "next/navigation";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="py-4 px-8 bg-muted h-full">
      <Image src={Logo} alt="Logo" className="mx-auto" />
      <div className="flex flex-col gap-y-4 mt-20">
        {links.map((link) => {
          return (
            <Button
              asChild
              key={link.label}
              variant={pathname === link.href ? "default" : "ghost"}
            >
              <Link href={link.href} className="flex items-center gap-x-2">
                {link.icon} <span className="capitalize">{link.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;
