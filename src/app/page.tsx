"use client";
import { Button } from "@/components/ui/button";
import useAppDispatch from "@/components/hooks/use-app-dispatch";
import { MailBlock, MailSkeleton } from "@/components/mail-block";
import Navbar from "@/components/ui/navbar";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import { updateSession } from "@/store/auth";
import { getDisplayMails } from "@/store/mails";
import { MailSearch, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {

  const { session, updatingSession } = useSelector((state: RootState) => state.user);
  const { displayMails, loadingDisplayMails } = useSelector((state: RootState) => state.mails);
  const appDispatch = useAppDispatch();
  const router = useRouter();

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchActive = isSearching && trimmedQuery !== "";

  const visibleMails = useMemo(() => {
    if (!searchActive) return displayMails;
    return displayMails.filter((mail) => {
      const haystack = `${mail.subject} ${mail.to} ${mail.from}`.toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  }, [searchActive, displayMails, trimmedQuery]);

  useEffect(() => {
    const main = async () => {
      if (!session && !updatingSession) {
        appDispatch(updateSession());
      }
      if (session && !loadingDisplayMails) {
        appDispatch(getDisplayMails());
      }
    };
    main();
  }, [session]);

  const handleStartSearch = () => {
    setIsSearching(true);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <>
      <Navbar />
      <div className="w-screen">
        <div className="w-9/10 md:w-4/5 min-h-[75svh] mx-auto ">
          <div className="w-full flex flex-col ">
            <div className="w-full px-5 py-4 bg-secondary/50 border-2 rounded rounded-b-none flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-mono">
                Sent Mails
              </h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 w-full sm:w-auto sm:justify-end">
                {isSearching && (
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Search mails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-background/80"
                    />
                  </div>
                )}
                <div className="flex flex-row flex-wrap gap-2 justify-end">
                  {isSearching ? (
                    <Button
                      variant="outline"
                      onClick={handleCancelSearch}
                      className="min-w-[100px]"
                    >
                      Cancel Search
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleStartSearch}
                      className="flex items-center gap-2 min-w-[100px]"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      router.push("/send");
                    }}
                    className="min-w-[100px]"
                  >
                    Send Mail
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full max-h-[80dvh] min-h-[50vh] overflow-y-auto rounded rounded-t-none shadow border border-t-0 bg-card">
              {!loadingDisplayMails && visibleMails.length === 0 && !searchActive && (
                <>
                  <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-2">
                    <MailSearch className="text-primary size-20 stroke-1" />
                    <h4 className="text-lg">No Sent Mails Found</h4>
                  </div>
                </>
              )}

              {!loadingDisplayMails && visibleMails.length === 0 && searchActive && (
                <>
                  <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-2">
                    <MailSearch className="text-primary size-20 stroke-1" />
                    <h4 className="text-lg">No mails match your search.</h4>
                  </div>
                </>
              )}

              {loadingDisplayMails && (
                <>
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                </>
              )}

              {!loadingDisplayMails &&
                visibleMails.length > 0 &&
                visibleMails.map((mail) => (
                  <MailBlock mail={mail} key={mail.id} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
