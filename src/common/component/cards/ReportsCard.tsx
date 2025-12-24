// components/ReportsCard.tsx
import React from "react";

export default function ReportsCard() {
  return (
    <div className="w-96 h-fit max-h-56 py-5  ">
      <div className="absolute inset-0 rounded-2xl shadow-[0_1px_4px_rgba(12,12,13,0.05)] blur-xl"></div>
      <div className="absolute inset-0 rounded-2xl shadow-[0_1px_4px_rgba(12,12,13,0.1)] blur-xl"></div>

      <div className="relative w-full h-full bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5]  items-start p-6 gap-6 space-y-3">
        <div className="shrink-0 mt-1">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#FF9933" />
              <path
                d="M26.332 28.6666H20.4987M32.1654 28.6666H35.6654V24.9916C35.6662 24.7139 35.5679 24.4451 35.3883 24.2334C35.2087 24.0217 34.9594 23.881 34.6854 23.8366L28.6654 22.8332L25.5154 18.6332C25.4067 18.4883 25.2658 18.3707 25.1038 18.2897C24.9418 18.2087 24.7632 18.1666 24.582 18.1666H16.112C15.6772 18.1635 15.2501 18.2821 14.8791 18.5088C14.508 18.7356 14.2077 19.0615 14.012 19.4499L13.0787 21.3516C12.5889 22.3253 12.3332 23.3999 12.332 24.4899V28.6666H14.6654"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17.5846 32.1666C19.1955 32.1666 20.5013 30.8607 20.5013 29.2499C20.5013 27.6391 19.1955 26.3333 17.5846 26.3333C15.9738 26.3333 14.668 27.6391 14.668 29.2499C14.668 30.8607 15.9738 32.1666 17.5846 32.1666Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M29.2487 32.1666C30.8595 32.1666 32.1654 30.8607 32.1654 29.2499C32.1654 27.6391 30.8595 26.3333 29.2487 26.3333C27.6379 26.3333 26.332 27.6391 26.332 29.2499C26.332 30.8607 27.6379 32.1666 29.2487 32.1666Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

        <div className="">
          <p className="text-sm text-black leading-relaxed">
            Generate custom reports with advanced filtering, scheduling, and
            multi-format export options.
          </p>
        </div>
         <div className="flex justify-between">
             <p>Total Reports</p>
             <p>57</p>
         </div>
      </div>
    </div>
  );
}
