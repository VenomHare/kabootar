"use client";
import { Button } from "@/components/button";
import useAppDispatch from "@/components/hooks/use-app-dispatch";
import { MailBlock, MailSkeleton } from "@/components/mail-block";
import Navbar from "@/components/ui/navbar";
import { RootState } from "@/store";
import { updateSession } from "@/store/auth";
import { getDisplayMails } from "@/store/mails";
import { MailSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {

  const { session, updatingSession } = useSelector((state: RootState) => state.user);
  const { displayMails, loadingDisplayMails } = useSelector((state: RootState) => state.mails);
  const appDispatch = useAppDispatch();
  const router = useRouter();


  useEffect(() => {
    const main = async () => {
      if (!session && !updatingSession) {
        appDispatch(updateSession());
      }
      if (session && !loadingDisplayMails) {
        appDispatch(getDisplayMails());
      }
    }
    main();
  }, [session])

  return (
    <>
      <Navbar />
      <div className="w-screen">
        <div className="w-9/10 md:w-4/5 min-h-[75svh] mx-auto ">
          <div className="w-full flex flex-col ">
            <div className="w-full px-5 py-4 bg-secondary/50 border-2 rounded rounded-b-none flex items-center justify-between ">
              <h3 className="text-lg font-mono">
                Sent Mails
              </h3>
              <Button onClick={() => { router.push("/send") }}>Send Mail</Button>
            </div>
            <div className="w-full max-h-[80dvh] min-h-[50vh] overflow-y-auto rounded rounded-t-none shadow border border-t-0 bg-card">
              {displayMails.length == 0 && !loadingDisplayMails && (<>
                <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-2">
                  <MailSearch className="text-primary size-20 stroke-1" />
                  <h4 className="text-lg">No Sent Mails Found</h4>
                </div>
              </>)}
              {
                loadingDisplayMails && (<>
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                  <MailSkeleton />
                </>)
              }

              {
                displayMails.length > 0 && !loadingDisplayMails &&
                displayMails.map(mail => (
                  <MailBlock mail={mail} key={mail.id}/>
                ))
              }

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
