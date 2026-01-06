"use client";

import axios from 'axios'
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import useAppDispatch from '@/components/hooks/use-app-dispatch';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateSession } from '@/store/auth';
import { useRouter } from 'next/navigation';

const FROM_ADDRESSES = [
    "no-reply@draftmymail.com",
    "hello@draftmymail.com",
    "sarthak@draftmymail.com",
];

type BodyType = "text" | "html";

const SendPage = () => {
    const [from, setFrom] = useState(FROM_ADDRESSES[0]);
    const [senderName, setSenderName] = useState("");
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [bodyType, setBodyType] = useState<BodyType>("text");
    const [textBody, setTextBody] = useState("");
    const [htmlBody, setHtmlBody] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});

    const { session, updatingSession } = useSelector((state: RootState) => state.user);
    const appDispatch = useAppDispatch()
    const router = useRouter();

    const isValid = useMemo(() => {
        if (!from || !senderName.trim() || !to.trim() || !subject.trim()) return false;
        if (bodyType === "text") return !!textBody.trim();
        return !!htmlBody.trim();
    }, [from, senderName, to, subject, bodyType, textBody, htmlBody]);

    useEffect(() => {
        if (!session && !updatingSession) {
            appDispatch(updateSession());
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error("Invalid Session");
            return
        }

        const newErrors: Record<string, string | undefined> = {};

        if (!from) newErrors.from = "From address is required";
        if (!senderName.trim()) newErrors.senderName = "Sender name is required";
        if (!to.trim()) newErrors.to = "Recipient email is required";
        if (!subject.trim()) newErrors.subject = "Subject is required";
        if (bodyType === "text" && !textBody.trim())
            newErrors.body = "Text body is required";
        if (bodyType === "html" && !htmlBody.trim())
            newErrors.body = "HTML body is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setIsSubmitting(true);
            const { data } = await axios.post("/api/sendmail", {
                from,
                senderName,
                to,
                subject,
                isHTML: bodyType == "html",
                data: bodyType == "html" ? htmlBody : textBody
            }, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            })
            if (data.status == "yellow") {
                toast.warning("Mail was sent, yet Failed to update in db!");
            }
            if (data.status == "green") {
                toast.success("Sent mail Successfully!");
                router.push("/");
            }

        }
        catch (err) {
            console.log(err);
            toast.error("Failed to send mail!");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            {/* Preview dialog */}
            {showPreview && bodyType === "html" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
                    <div className="relative h-full w-full bg-background text-foreground sm:h-[80vh] sm:max-w-4xl sm:rounded-xl sm:border sm:shadow-lg">
                        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
                            <h2 className="text-lg font-semibold">HTML Preview</h2>
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                type="button"
                                onClick={() => setShowPreview(false)}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="h-[calc(100%-3.25rem)] overflow-auto p-4 sm:p-6">
                            <div
                                className="prose max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: htmlBody }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-hidden">
                <div className="mx-auto flex min-h-[75svh] w-11/12 max-w-4xl py-6 md:py-10">
                    <Card className="w-full bg-background/60 backdrop-blur border-primary/20">
                        <CardHeader>
                            <CardTitle className="font-mono text-2xl font-bold md:text-3xl">
                                Send Mail
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="flex flex-col space-y-6"
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <FieldSet>
                                    <FieldGroup>
                                        {/* From */}
                                        <Field data-invalid={!!errors.from}>
                                            <FieldLabel>
                                                <FieldTitle>From</FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="flex w-full items-center justify-between"
                                                        >
                                                            <span className="truncate text-left">
                                                                {from || "Select from address"}
                                                            </span>
                                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                                                        {FROM_ADDRESSES.map((address) => (
                                                            <DropdownMenuItem
                                                                key={address}
                                                                onSelect={() => setFrom(address)}
                                                            >
                                                                {address}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <FieldDescription>
                                                    Choose the sender email address.
                                                </FieldDescription>
                                                <FieldError
                                                    errors={
                                                        errors.from ? [{ message: errors.from }] : undefined
                                                    }
                                                />
                                            </FieldContent>
                                        </Field>

                                        {/* Sender Name */}
                                        <Field data-invalid={!!errors.senderName}>
                                            <FieldLabel>
                                                <FieldTitle>Sender name</FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    required
                                                    placeholder="Your name"
                                                    value={senderName}
                                                    onChange={(e) => setSenderName(e.target.value)}
                                                />
                                                <FieldError
                                                    errors={
                                                        errors.senderName
                                                            ? [{ message: errors.senderName }]
                                                            : undefined
                                                    }
                                                />
                                            </FieldContent>
                                        </Field>

                                        {/* To */}
                                        <Field data-invalid={!!errors.to}>
                                            <FieldLabel>
                                                <FieldTitle>To</FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder="recipient@example.com"
                                                    value={to}
                                                    onChange={(e) => setTo(e.target.value)}
                                                />
                                                <FieldError
                                                    errors={
                                                        errors.to ? [{ message: errors.to }] : undefined
                                                    }
                                                />
                                            </FieldContent>
                                        </Field>

                                        {/* Subject */}
                                        <Field data-invalid={!!errors.subject}>
                                            <FieldLabel>
                                                <FieldTitle>Subject</FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    required
                                                    placeholder="Subject line"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                />
                                                <FieldError
                                                    errors={
                                                        errors.subject
                                                            ? [{ message: errors.subject }]
                                                            : undefined
                                                    }
                                                />
                                            </FieldContent>
                                        </Field>

                                        {/* Body type toggle */}
                                        <Field>
                                            <FieldLabel>
                                                <FieldTitle>Content type</FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setBodyType("text")}
                                                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${bodyType === "text"
                                                            ? "border-primary bg-primary/10 text-primary"
                                                            : "border-border bg-background hover:bg-accent"
                                                            }`}
                                                    >
                                                        Text
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setBodyType("html")}
                                                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${bodyType === "html"
                                                            ? "border-primary bg-primary/10 text-primary"
                                                            : "border-border bg-background hover:bg-accent"
                                                            }`}
                                                    >
                                                        HTML
                                                    </button>
                                                </div>
                                                <FieldDescription>
                                                    Choose whether to send a plain text or HTML email.
                                                </FieldDescription>
                                            </FieldContent>
                                        </Field>

                                        {/* Body */}
                                        <Field data-invalid={!!errors.body}>
                                            <FieldLabel>
                                                <FieldTitle>
                                                    {bodyType === "text" ? "Text body" : "HTML body"}
                                                </FieldTitle>
                                            </FieldLabel>
                                            <FieldContent>
                                                {bodyType === "text" ? (
                                                    <textarea
                                                        required
                                                        className="border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1 min-h-[160px] w-full rounded-md px-3 py-2 text-sm shadow-xs outline-none"
                                                        placeholder="Write your message..."
                                                        value={textBody}
                                                        onChange={(e) => setTextBody(e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="space-y-3">
                                                        <textarea
                                                            required
                                                            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1 min-h-[160px] w-full rounded-md px-3 py-2 text-sm shadow-xs outline-none font-mono"
                                                            placeholder="<h1>Hello Kabootar</h1>"
                                                            value={htmlBody}
                                                            onChange={(e) => setHtmlBody(e.target.value)}
                                                        />
                                                        <div className="flex justify-end">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                disabled={!htmlBody.trim()}
                                                                onClick={() => setShowPreview(true)}
                                                            >
                                                                Preview
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                                <FieldError
                                                    errors={
                                                        errors.body ? [{ message: errors.body }] : undefined
                                                    }
                                                />
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        All fields are required. Make sure everything looks good
                                        before sending.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !isValid}
                                        className="w-full sm:w-auto"
                                    >
                                        {isSubmitting ? "Sending..." : "Send mail"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SendPage;