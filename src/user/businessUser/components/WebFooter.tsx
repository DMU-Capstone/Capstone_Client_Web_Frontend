import React from "react";
import instaIcon from '../../../asset/insta.png';
import playstoreIcon from '../../../asset/playstore.png';
import appstoreIcon from '../../../asset/appstore.png';
import WaitItLogo from '../../../asset/WaitItLogo.png'

const Footer: React.FC = () => {
    return (
        <footer className="mt-20 border-t border-gray-100 bg-gray-50">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            
            <div className="space-y-2 text-sm text-gray-700 text-left">
                <div className="flex items-center gap-2">
                    <img
                        src={WaitItLogo}
                        alt="Wait:It Logo"
                        className="h-10 w-auto object-contain"
                    />
                </div>
                <p>08221 서울시 구로구 경인로 445 (대구로센동 62-160) 동양미래대학교</p>
                <p>대표 : 김태우</p>
                <p>TEL. 02-2610-1700</p>
                <p className="text-xs text-gray-500">
                    COPYRIGHT(c) DONGYANG MIRAE UNIVERSITY. ALL RIGHTS RESERVED.
                </p>
            </div>

            <div className="flex items-center gap-6">
                <a href="#" aria-label="Instagram">
                <img
                    src={instaIcon}
                    alt="Instagram"
                    className="w-8 h-8 hover:opacity-80 transition"
                />
                </a>
                <a href="#" aria-label="Google Play">
                <img
                    src={playstoreIcon}
                    alt="Google Play"
                    className="w-8 h-8 hover:opacity-80 transition"
                />
                </a>
                <a href="#" aria-label="App Store">
                <img
                    src={appstoreIcon}
                    alt="App Store"
                    className="w-8 h-8 hover:opacity-80 transition"
                />
                </a>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;