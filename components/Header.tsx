import Image from "next/image";

const Header = () => {
  return (
    <div className="container px-4 lg:px-0 mt-24 mb-4">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-5"></div>
        <div className="col-span-2 flex items-center justify-center">
          <a href="/">
            <Image
              unoptimized
              src="/logo.png"
              alt="logo"
              width={40}
              height={39}
              className="h-[33px] w-[35px] lg:h-10 lg:w-10"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
