import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-toggle";
import { RootState } from "@/store";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setSession } from "@/store/auth";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    const { session } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            dispatch(setSession(session));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <nav className="w-full h-20 backdrop-blur-2xl border-lg border-primary">
                <div className="w-full md:w-4/5 px-4 md:px-auto h-full flex justify-between items-center mx-auto">
                    <Link href={"/"} className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Kabootar logo"
                            width={32}
                            height={32}
                            className="rounded-md"
                        />
                        <h1 className="text-2xl">Kabootar</h1>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <ModeToggle />
                        {session && (
                            <>
                                <Button
                                    variant={"destructive"}
                                    className="cursor-pointer"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.push(
                                            `/login?redirect=${pathname}`
                                        );
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;