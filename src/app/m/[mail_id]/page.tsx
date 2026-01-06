import ServerNavbar from "@/components/ui/server-navbar";
import { getServiceSupabase } from "@/lib/supabase";
import { MailData } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export const revalidate = 0; // always render server-side with fresh data
export const dynamic = "force-dynamic";

const isLikelyHtml = (body: string) => /<\/?[a-z][\s\S]*>/i.test(body.trim());

const sanitizeHtml = (dirty: string): string => {
    if (!dirty) return "";

    let cleaned = dirty;

    // Remove <script> blocks
    cleaned = cleaned.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // Remove inline event handler attributes (onclick, onerror, etc.)
    cleaned = cleaned.replace(/\son\w+\s*=\s*"(.*?)"/gi, "");
    cleaned = cleaned.replace(/\son\w+\s*=\s*'(.*?)'/gi, "");

    // Remove javascript: URLs
    cleaned = cleaned.replace(/href\s*=\s*"(javascript:[^"]*)"/gi, 'href="#"');
    cleaned = cleaned.replace(/href\s*=\s*'(javascript:[^']*)'/gi, "href='#'");

    return cleaned;
};

const fetchMail = async (mailId: string): Promise<MailData | null> => {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
        .from("kabootar_emails")
        .select("id,from,to,subject,body,sent_at")
        .eq("id", mailId)
        .single();

    if (error || !data) {
        return null;
    }

    return data as MailData;
};

const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

const MailPage = async ({
    params,
}: {
    params: Promise<{ mail_id: string }>;
}) => {
    const { mail_id } = await params;
    const mail = await fetchMail(mail_id);

    if (!mail) {
        notFound();
    }

    const htmlBody = isLikelyHtml(mail.body);
    const sanitizedHtml = htmlBody ? sanitizeHtml(mail.body) : "";
    return (
        <>
        <ServerNavbar />
        <main className="min-h-screen bg-background/40">
            <div className="mx-auto w-11/12 max-w-4xl py-8 md:py-12">
                <div className="mb-6 flex">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/80 transition-colors border border-accent-foreground/10"
                    >
                        <ChevronLeft/>
                        Back to All Sent Mails
                    </Link>
                </div>
                <div className="rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-3 border-b border-border p-5 md:p-6">
                        
                        <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                            {mail.subject || "No subject"}
                        </h1>
                        <dl className="flex flex-col gap-3 text-sm text-foreground md:grid-cols-3 font-mono">
                            <div className="space-y-1">
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">From</dt>
                                <dd className="truncate">{mail.from}</dd>
                            </div>
                            <div className="space-y-1">
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">To</dt>
                                <dd className="truncate">{mail.to}</dd>
                            </div>
                            <div className="space-y-1">
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Sent</dt>
                                <dd>{mail.sent_at ? formatDate(mail.sent_at) : "Unknown"}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="p-5 md:p-6">
                        {htmlBody ? (
                            <div className="overflow-x-auto">
                                <div
                                    className="prose max-w-none wrap-break-word text-foreground prose-headings:mt-4 prose-headings:mb-2 prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-pre:whitespace-pre-wrap prose-pre:break-words prose-table:min-w-full prose-img:max-w-full prose-img:h-auto dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                                />
                            </div>
                        ) : (
                            <pre className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground font-mono">
                                {mail.body || "No content"}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </>
    );
};

export default MailPage;