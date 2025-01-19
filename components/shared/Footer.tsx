import { Github, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="container z-50 flex min-h-[72px] items-center justify-between border-t border-[#D2D2D2] px-4 pb-3 pt-5 lg:min-h-[72px] lg:px-0 lg:py-5">
        <a href="/" className="flex items-center gap-2.5">
          <Image
            unoptimized
            src="/logo.png"
            alt="footer"
            width={31}
            height={30}
          />
          <span className="text-base font-medium leading-[normal]">
            SwiftSeek
          </span>
        </a>
        <div className="flex items-center gap-3">
          <Link href="https://x.com/mvp_Subha" target="_blank">
            <Twitter size={16} />
          </Link>
          <Link href="https://github.com/subhadeeproy3902" target="_blank">
           <Github size={16} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
