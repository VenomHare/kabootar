import Link from "next/link";
import Image from "next/image";

const ServerNavbar = () => {
  return (
    <nav className="w-full h-20 backdrop-blur-2xl border-lg border-primary">
      <div className="w-full md:w-4/5 px-4 md:px-0 h-full flex justify-between items-center mx-auto">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Kabootar logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <h1 className="text-2xl font-semibold">Kabootar</h1>
        </Link>
      </div>
    </nav>
  );
};

export default ServerNavbar;

