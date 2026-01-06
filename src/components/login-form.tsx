"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormEvent, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useAppDispatch from "./hooks/use-app-dispatch";
import { updateSession } from "@/store/auth";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { session, updatingSession } = useSelector((state: RootState) => state.user);
    const appDispatch = useAppDispatch();
    const router = useRouter()
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/";

    const handleLogin = async (e: FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) {
                if (error.code == "invalid_credentials") {
                    toast.error("Invalid Credentials");
                    return
                }
                else {
                    throw error;
                }
            }

            router.push(redirect);
        }
        catch {
            toast.error("Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!session && !updatingSession) {
            appDispatch(updateSession());
        }

        if (session) {
            router.push(redirect);
        }
    }, [session])

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to Kabootar</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={loading}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
                                <Input id="password" type="password" disabled={loading} onChange={(e) => { setPassword(e.target.value) }} required />
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading}>Login</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}