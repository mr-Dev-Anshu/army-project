"use client";

import React from "react";
import Link from "next/link";
import {
    Book,
    Key,
    LogIn,
    Smartphone,
    Car,
    Truck,
    Binoculars,
    Shield,
    CalendarDays,
    Scan,
    CarFront,
    Phone,
    Contact,
    Building2,
    PhoneCall,
    Search,
    BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for our register items
interface RegisterItem {
    title: React.ReactNode;
    icon: React.ReactNode;
    route?: string;
}

interface RegisterSection {
    title: string;
    count: string;
    items: RegisterItem[];
}

const RegisterBooks = () => {
    const sections: RegisterSection[] = [
        {
            title: "Daily Operations Registers",
            count: "10",
            items: [
                {
                    title: "MP General Diary & Daily Occurrence Book",
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M14.6665 32.7526C14.6665 31.9791 14.9738 31.2372 15.5208 30.6902C16.0678 30.1432 16.8096 29.8359 17.5832 29.8359H33.3332" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.5832 12.3359H33.3332V35.6693H17.5832C16.8096 35.6693 16.0678 35.362 15.5208 34.815C14.9738 34.268 14.6665 33.5262 14.6665 32.7526V15.2526C14.6665 14.4791 14.9738 13.7372 15.5208 13.1902C16.0678 12.6432 16.8096 12.3359 17.5832 12.3359Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/mp-general-diary-daily-occurrence-book",
                },
                {
                    title: "Original Military Police General Duty Diary",
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M19.334 13.5H12.334V31H20.5007C22.484 31 24.0007 32.5167 24.0007 34.5V18.1667C24.0007 15.6 21.9007 13.5 19.334 13.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M28.666 23.9974L30.9993 26.3307L35.666 21.6641" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M35.6667 17V13.5H28.6667C26.1 13.5 24 15.6 24 18.1667V34.5C24 32.5167 25.5167 31 27.5 31H35.6667V28.3167" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>,
                    route: "/analysis/registers-books/original-military-police-general-duty-diary",
                },
                {
                    title: (
                        <span>
                            21 Corps Provost Unit <strong>Key Out | In</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M34.4993 12.3359L32.166 14.6693M32.166 14.6693L35.666 18.1693L31.5827 22.2526L28.0827 18.7526M32.166 14.6693L28.0827 18.7526M23.2877 23.5476C23.8901 24.142 24.3689 24.8496 24.6967 25.6299C25.0245 26.4101 25.1947 27.2474 25.1975 28.0937C25.2004 28.9399 25.0358 29.7784 24.7132 30.5608C24.3907 31.3432 23.9166 32.054 23.3182 32.6524C22.7198 33.2508 22.0089 33.725 21.2265 34.0475C20.4441 34.37 19.6057 34.5346 18.7594 34.5318C17.9132 34.529 17.0758 34.3588 16.2956 34.031C15.5154 33.7032 14.8077 33.2243 14.2133 32.6219C13.0445 31.4117 12.3977 29.7909 12.4124 28.1084C12.427 26.426 13.1018 24.8166 14.2915 23.6269C15.4812 22.4372 17.0906 21.7624 18.773 21.7478C20.4554 21.7332 22.0763 22.3799 23.2865 23.5488L23.2877 23.5476ZM23.2877 23.5476L28.0827 18.7526" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/21-corps-provost-unit-key-out-In",
                },
                {
                    title: (
                        <span>
                            <strong>Duty In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M25.5 13.5H30.1667C30.7855 13.5 31.379 13.7458 31.8166 14.1834C32.2542 14.621 32.5 15.2145 32.5 15.8333V32.1667C32.5 32.7855 32.2542 33.379 31.8166 33.8166C31.379 34.2542 30.7855 34.5 30.1667 34.5H25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19.666 29.8307L25.4993 23.9974L19.666 18.1641" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M25.5 24H11.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/duty-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>Mobile Phone In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M29.834 12.3359H18.1673C16.8787 12.3359 15.834 13.3806 15.834 14.6693V33.3359C15.834 34.6246 16.8787 35.6693 18.1673 35.6693H29.834C31.1227 35.6693 32.1673 34.6246 32.1673 33.3359V14.6693C32.1673 13.3806 31.1227 12.3359 29.834 12.3359Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 31H24.0117" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/mobile-phone-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>Vehicle In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M26.334 28.6641H20.5007M32.1673 28.6641H35.6673V24.9891C35.6681 24.7115 35.5699 24.4427 35.3903 24.2309C35.2106 24.0192 34.9614 23.8785 34.6873 23.8341L28.6673 22.8308L25.5173 18.6308C25.4086 18.4859 25.2677 18.3683 25.1057 18.2873C24.9437 18.2063 24.7651 18.1641 24.584 18.1641H16.114C15.6791 18.1611 15.2521 18.2796 14.881 18.5064C14.51 18.7332 14.2097 19.0591 14.014 19.4475L13.0807 21.3491C12.5908 22.3228 12.3351 23.3975 12.334 24.4875V28.6641H14.6673" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.5827 32.1693C19.1935 32.1693 20.4993 30.8634 20.4993 29.2526C20.4993 27.6418 19.1935 26.3359 17.5827 26.3359C15.9719 26.3359 14.666 27.6418 14.666 29.2526C14.666 30.8634 15.9719 32.1693 17.5827 32.1693Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.2507 32.1693C30.8615 32.1693 32.1673 30.8634 32.1673 29.2526C32.1673 27.6418 30.8615 26.3359 29.2507 26.3359C27.6398 26.3359 26.334 27.6418 26.334 29.2526C26.334 30.8634 27.6398 32.1693 29.2507 32.1693Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/vehicle-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>Convoy In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M32.1673 29.8359H34.5007L35.2473 26.8726C35.5273 25.7538 35.5273 24.5836 35.2473 23.4659L33.999 18.4843C33.8092 17.7276 33.372 17.0561 32.7569 16.5763C32.1418 16.0965 31.3841 15.8359 30.604 15.8359H14.6673C14.0485 15.8359 13.455 16.0818 13.0174 16.5194C12.5798 16.9569 12.334 17.5504 12.334 18.1693V29.8359H14.6673" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M26.3333 29.8359H20.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17.5827 33.3333C19.1935 33.3333 20.4993 32.0275 20.4993 30.4167C20.4993 28.8058 19.1935 27.5 17.5827 27.5C15.9719 27.5 14.666 28.8058 14.666 30.4167C14.666 32.0275 15.9719 33.3333 17.5827 33.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.2507 33.3333C30.8615 33.3333 32.1673 32.0275 32.1673 30.4167C32.1673 28.8058 30.8615 27.5 29.2507 27.5C27.6398 27.5 26.334 28.8058 26.334 30.4167C26.334 32.0275 27.6398 33.3333 29.2507 33.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/convoy-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>Recce In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M21.666 21.6641H26.3327" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M32.1667 18.1667V14.6667C32.1667 14.3572 32.0438 14.0605 31.825 13.8417C31.6062 13.6229 31.3094 13.5 31 13.5H28.6667C28.3572 13.5 28.0605 13.6229 27.8417 13.8417C27.6229 14.0605 27.5 14.3572 27.5 14.6667V18.1667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33.334 34.4974C33.9528 34.4974 34.5463 34.2516 34.9839 33.814C35.4215 33.3764 35.6673 32.7829 35.6673 32.1641V27.6712C35.6673 26.0496 33.334 24.2156 33.334 22.0374V19.3307C33.334 19.0213 33.2111 18.7246 32.9923 18.5058C32.7735 18.287 32.4767 18.1641 32.1673 18.1641H27.5007C27.1912 18.1641 26.8945 18.287 26.6757 18.5058C26.4569 18.7246 26.334 19.0213 26.334 19.3307V32.1641C26.334 32.7829 26.5798 33.3764 27.0174 33.814C27.455 34.2516 28.0485 34.4974 28.6673 34.4974H33.334Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M35.6673 28.6641H12.334" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14.6673 34.4974C14.0485 34.4974 13.455 34.2516 13.0174 33.814C12.5798 33.3764 12.334 32.7829 12.334 32.1641V27.6712C12.334 26.0496 14.6673 24.2156 14.6673 22.0374V19.3307C14.6673 19.0213 14.7902 18.7246 15.009 18.5058C15.2278 18.287 15.5246 18.1641 15.834 18.1641H20.5007C20.8101 18.1641 21.1068 18.287 21.3256 18.5058C21.5444 18.7246 21.6673 19.0213 21.6673 19.3307V32.1641C21.6673 32.7829 21.4215 33.3764 20.9839 33.814C20.5463 34.2516 19.9528 34.4974 19.334 34.4974H14.6673Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20.5007 18.1667V14.6667C20.5007 14.3572 20.3777 14.0605 20.1589 13.8417C19.9401 13.6229 19.6434 13.5 19.334 13.5H17.0007C16.6912 13.5 16.3945 13.6229 16.1757 13.8417C15.9569 14.0605 15.834 14.3572 15.834 14.6667V18.1667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/recce-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>MINI Kote Arms / AMN In | Out</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M23.9993 35.6693C23.9993 35.6693 33.3327 31.0026 33.3327 24.0026V15.8359L23.9993 12.3359L14.666 15.8359V24.0026C14.666 31.0026 23.9993 35.6693 23.9993 35.6693Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/mini-kote-arms-amn-in-out",
                },
                {
                    title: (
                        <span>
                            <strong>Duty Roster</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M32.1667 14.6641H15.8333C14.5447 14.6641 13.5 15.7087 13.5 16.9974V33.3307C13.5 34.6194 14.5447 35.6641 15.8333 35.6641H32.1667C33.4553 35.6641 34.5 34.6194 34.5 33.3307V16.9974C34.5 15.7087 33.4553 14.6641 32.1667 14.6641Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M28.666 12.3359V17.0026" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19.334 12.3359V17.0026" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.5 21.6641H34.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20.5 28.6693L22.8333 31.0026L27.5 26.3359" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/duty-roster",
                },
            ],
        },
        {
            title: "Occasional Use Registers",
            count: "04",
            items: [
                {
                    title: (
                        <span>
                            <strong>MT Accident </strong> Register: 21 CORPs PRO
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M26 28H21M31 28H34V24.85C34.0007 24.6121 33.9165 24.3816 33.7625 24.2002C33.6085 24.0187 33.3949 23.8981 33.16 23.86L28 23L25.3 19.4C25.2069 19.2759 25.0861 19.175 24.9472 19.1056C24.8084 19.0362 24.6552 19 24.5 19H17.24C16.8673 18.9975 16.5012 19.0991 16.1832 19.2934C15.8651 19.4878 15.6077 19.7672 15.44 20.1L14.64 21.73C14.2201 22.5647 14.001 23.4858 14 24.42V28H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18.5 31C19.8807 31 21 29.8807 21 28.5C21 27.1193 19.8807 26 18.5 26C17.1193 26 16 27.1193 16 28.5C16 29.8807 17.1193 31 18.5 31Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M28.5 31C29.8807 31 31 29.8807 31 28.5C31 27.1193 29.8807 26 28.5 26C27.1193 26 26 27.1193 26 28.5C26 29.8807 27.1193 31 28.5 31Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    ,
                    route: "/analysis/registers-books/mt-accident-21-corp-pro",
                },
                {
                    title: (
                        <span>
                            <strong>Lost & Found</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M24 29H25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 34H25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 14H25.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.5 34H31C31.2652 34 31.5196 33.8946 31.7071 33.7071C31.8946 33.5196 32 33.2652 32 33" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.5 14H31C31.2652 14 31.5196 14.1054 31.7071 14.2929C31.8946 14.4804 32 14.7348 32 15V16.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M32 26V29H29.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M32 20.5V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 22V20.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 31.5V26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 16.5C16 15.837 16.2634 15.2011 16.7322 14.7322C17.2011 14.2634 17.837 14 18.5 14H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 34H18.5C17.837 34 17.2011 33.7366 16.7322 33.2678C16.2634 32.7989 16 32.163 16 31.5C16 30.837 16.2634 30.2011 16.7322 29.7322C17.2011 29.2634 17.837 29 18.5 29H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/lost-and-found",
                },
                {
                    title: (
                        <span>
                            <strong>Vehicle Demand</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M22 14H26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33 20.0005L31 22.0005L29.5 18.3005C29.3585 17.9219 29.1057 17.595 28.7747 17.3629C28.4437 17.1308 28.0502 17.0045 27.646 17.0005H20.4C19.9925 16.9912 19.5919 17.1065 19.2518 17.3312C18.9117 17.5558 18.6483 17.8791 18.497 18.2575L17 22.0005L15 20.0005" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M19 26H19.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29 26H29.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31 22H17C15.8954 22 15 22.8954 15 24V28C15 29.1046 15.8954 30 17 30H31C32.1046 30 33 29.1046 33 28V24C33 22.8954 32.1046 22 31 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17 30V32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31 30V32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/vehicle-demand",
                },
                {
                    title: (
                        <span>
                            Army Help Line <strong>Complaints Record</strong> Register
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M33.6657 31.7427V35.2427C33.667 35.5676 33.6005 35.8892 33.4703 36.187C33.3401 36.4847 33.1492 36.7519 32.9098 36.9716C32.6704 37.1912 32.3877 37.3584 32.0799 37.4625C31.7721 37.5666 31.446 37.6053 31.1224 37.5761C27.5323 37.186 24.0839 35.9592 21.054 33.9944C18.2352 32.2032 15.8453 29.8133 14.054 26.9944C12.0823 23.9508 10.8553 20.4855 10.4724 16.8794C10.4432 16.5568 10.4815 16.2316 10.5849 15.9246C10.6883 15.6176 10.8545 15.3355 11.0729 15.0963C11.2913 14.857 11.5571 14.6659 11.8534 14.535C12.1498 14.4041 12.4701 14.3364 12.794 14.3361H16.294C16.8602 14.3305 17.4091 14.531 17.8384 14.9002C18.2677 15.2694 18.5481 15.7821 18.6274 16.3427C18.7751 17.4628 19.0491 18.5626 19.444 19.6211C19.601 20.0386 19.635 20.4925 19.5419 20.9287C19.4489 21.365 19.2327 21.7655 18.919 22.0827L17.4374 23.5644C19.0982 26.4852 21.5166 28.9036 24.4374 30.5644L25.919 29.0827C26.2362 28.769 26.6367 28.5529 27.073 28.4598C27.5093 28.3668 27.9631 28.4007 28.3807 28.5577C29.4392 28.9527 30.5389 29.2267 31.659 29.3744C32.2258 29.4543 32.7433 29.7398 33.1133 30.1765C33.4833 30.6131 33.6799 31.1706 33.6657 31.7427Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24.3926 14.3359C26.7706 14.5865 28.9918 15.6412 30.6889 17.3256C32.3861 19.01 33.4575 21.2233 33.7259 23.5993" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24.3926 19C25.54 19.2263 26.5929 19.7922 27.4147 20.6244C28.2365 21.4565 28.7891 22.5165 29.0009 23.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/army-help-line-complaints-record",
                },
            ],
        },
        {
            title: "Contact Information Registers",
            count: "03",
            items: [
                {
                    title: (
                        <span>
                            Contact Info. of <strong>Army Personnel</strong>
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M27 25C27 24.2044 26.6839 23.4413 26.1213 22.8787C25.5587 22.3161 24.7956 22 24 22C23.2044 22 22.4413 22.3161 21.8787 22.8787C21.3161 23.4413 21 24.2044 21 25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 31.5V16.5C16 15.837 16.2634 15.2011 16.7322 14.7322C17.2011 14.2634 17.837 14 18.5 14H31C31.2652 14 31.5196 14.1054 31.7071 14.2929C31.8946 14.4804 32 14.7348 32 15V33C32 33.2652 31.8946 33.5196 31.7071 33.7071C31.5196 33.8946 31.2652 34 31 34H18.5C17.837 34 17.2011 33.7366 16.7322 33.2678C16.2634 32.7989 16 32.163 16 31.5ZM16 31.5C16 30.837 16.2634 30.2011 16.7322 29.7322C17.2011 29.2634 17.837 29 18.5 29H32" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 22C25.1046 22 26 21.1046 26 20C26 18.8954 25.1046 18 24 18C22.8954 18 22 18.8954 22 20C22 21.1046 22.8954 22 24 22Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/contact-info-army-personnel",
                },
                {
                    title: (
                        <span>
                            Contact Info. of <strong>Civil Police Station</strong>
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M27 25C27 24.2044 26.6839 23.4413 26.1213 22.8787C25.5587 22.3161 24.7956 22 24 22C23.2044 22 22.4413 22.3161 21.8787 22.8787C21.3161 23.4413 21 24.2044 21 25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 31.5V16.5C16 15.837 16.2634 15.2011 16.7322 14.7322C17.2011 14.2634 17.837 14 18.5 14H31C31.2652 14 31.5196 14.1054 31.7071 14.2929C31.8946 14.4804 32 14.7348 32 15V33C32 33.2652 31.8946 33.5196 31.7071 33.7071C31.5196 33.8946 31.2652 34 31 34H18.5C17.837 34 17.2011 33.7366 16.7322 33.2678C16.2634 32.7989 16 32.163 16 31.5ZM16 31.5C16 30.837 16.2634 30.2011 16.7322 29.7322C17.2011 29.2634 17.837 29 18.5 29H32" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M24 22C25.1046 22 26 21.1046 26 20C26 18.8954 25.1046 18 24 18C22.8954 18 22 18.8954 22 20C22 21.1046 22.8954 22 24 22Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/contact-info-civil-police-station",
                },
                {
                    title: (
                        <span>
                            <strong>Military Police Control Room –</strong> Contact Directory
                            (All India)
                        </span>
                    ),
                    icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#404040" />
                        <path d="M27.5 25.1641C27.5 24.2358 27.1313 23.3456 26.4749 22.6892C25.8185 22.0328 24.9283 21.6641 24 21.6641C23.0717 21.6641 22.1815 22.0328 21.5251 22.6892C20.8687 23.3456 20.5 24.2358 20.5 25.1641" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14.666 32.7526V15.2526C14.666 14.4791 14.9733 13.7372 15.5203 13.1902C16.0673 12.6432 16.8091 12.3359 17.5827 12.3359H32.166C32.4754 12.3359 32.7722 12.4589 32.991 12.6776C33.2098 12.8964 33.3327 13.1932 33.3327 13.5026V34.5026C33.3327 34.812 33.2098 35.1088 32.991 35.3276C32.7722 35.5464 32.4754 35.6693 32.166 35.6693H17.5827C16.8091 35.6693 16.0673 35.362 15.5203 34.815C14.9733 34.268 14.666 33.5262 14.666 32.7526ZM14.666 32.7526C14.666 31.9791 14.9733 31.2372 15.5203 30.6902C16.0673 30.1432 16.8091 29.8359 17.5827 29.8359H33.3327" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M23.9993 21.6667C25.288 21.6667 26.3327 20.622 26.3327 19.3333C26.3327 18.0447 25.288 17 23.9993 17C22.7107 17 21.666 18.0447 21.666 19.3333C21.666 20.622 22.7107 21.6667 23.9993 21.6667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    ,
                    route: "/analysis/registers-books/military-police-control-room-contact-directory",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 p-8 font-inter text-neutral-900">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Book className="w-4 h-4" />
                <span>Reports & Analysis</span>
                <span className="text-neutral-400">›</span>
                <span className="font-semibold text-neutral-900">Registers/Books</span>
            </div>

            {/* Main Title */}
            <div className="mb-8">
                <h1 className="text-xl font-bold text-neutral-800">
                    All Registers/Books
                </h1>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-10">
                {sections.map((section, idx) => (
                    <section key={idx} className="space-y-4">
                        {/* Section Header */}
                        <div className="rounded-lg bg-black px-6 py-3 text-white shadow-md flex items-center justify-between">
                            <h2 className="text-base font-bold tracking-wide">
                                {section.title}
                            </h2>
                            <span className="text-sm font-bold opacity-90">
                                {section.count}
                            </span>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {section.items.map((item, itemIdx) => (
                                <Link
                                    key={itemIdx}
                                    href={item.route || "#"}
                                    className="block group"
                                >
                                    <div
                                        className="relative flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg cursor-pointer h-full"
                                    >
                                        {/* Icon */}
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-black">
                                            {item.icon}
                                        </div>

                                        {/* Title */}
                                        <div className="text-lg font-medium leading-snug text-neutral-800">
                                            {item.title}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default RegisterBooks;
