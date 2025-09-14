"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
    //router.push("/");
    
  };

  return (
     
    <div className="drawer lg:drawer-open min-h-screen">
      {/* Drawer toggle checkbox (controls sidebar for mobile) */}
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Page content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
       <header className="w-full bg-neutral ">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hamburger on mobile */}
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon />
              </label>
            </div>

            {/* Logo */}
            <div className="flex-1">
              <Link href="/" onClick={handleLogoClick}>
                <div className="text-white btn btn-ghost normal-case text-2xl font-bold tracking-tight cursor-pointer">
                  SnapShrink Showcase
                </div>
              </Link>
            </div>

            {/* User section */}
           <div className="text-base-content flex-none flex items-center space-x-4 bg-neutral px-2 py-1 rounded-md ">
              {user && (
                <>
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={user.imageUrl}
                        alt={
                          user.username || user.emailAddresses[0].emailAddress
                        }
                      />
                    </div>
                  </div>
                  <span className="hidden sm:inline text-sm truncate max-w-xs lg:max-w-md">
                    {user.username || user.emailAddresses[0].emailAddress}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-circle"
                  >
                    <LogOutIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main page body */}
        <main className="flex-grow bg-base-100">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-30">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
       <aside className="bg-neutral w-64 h-full flex flex-col">
          {/* Logo/Icon */}
          <div className="flex items-center justify-center py-4">
            <ImageIcon className="w-10 h-10 text-white" />
          </div>

          {/* Navigation items */}
          <ul className=" menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`"text-base-content  flex items-center space-x-4 px-4 py-2 rounded-lg ${
                    pathname === item.href
                      ? "bg-[oklch(49.85%_0.25305_301.291)] text-white "
                      : "hover:bg-base-300"
                  }`}
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Sign out button */}
          {user && (
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-full"
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  
  );
}
