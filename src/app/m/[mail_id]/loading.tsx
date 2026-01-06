const MailLoading = () => {
    return (
        <main className="min-h-screen bg-background/40">
            <div className="mx-auto w-11/12 max-w-4xl py-8 md:py-12">
                <div className="animate-pulse rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur">
                    <div className="border-b border-border p-5 md:p-6 space-y-3">
                        <div className="h-3 w-40 rounded bg-muted" />
                        <div className="h-8 w-3/4 rounded bg-muted" />
                        <div className="flex flex-wrap gap-3">
                            <div className="h-4 w-32 rounded bg-muted" />
                            <div className="h-4 w-32 rounded bg-muted" />
                            <div className="h-4 w-28 rounded bg-muted" />
                        </div>
                    </div>
                    <div className="p-5 md:p-6 space-y-3">
                        <div className="h-4 w-full rounded bg-muted" />
                        <div className="h-4 w-11/12 rounded bg-muted" />
                        <div className="h-4 w-10/12 rounded bg-muted" />
                        <div className="h-4 w-9/12 rounded bg-muted" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MailLoading;

