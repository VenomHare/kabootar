import { getServiceSupabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: NextRequest) => {
    try {
        const SMTP_HOST = process.env.SMTP_HOST!;
        const SMTP_PORT = process.env.SMTP_PORT!;
        const SMTP_USER = process.env.SMTP_USER!;
        const SMTP_PASS = process.env.SMTP_PASS!;

        const ALLOWED_UUIDs = process.env.ALLOWED_UUIDs!.split(",");
        const supabase = getServiceSupabase();
        let user_id;

        try {

            const token = req.headers.get("authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new Error("No Token");
            }

            const { error: sessionError, data: { user } } = await supabase.auth.getUser(token);

            if (sessionError || !user) {
                throw new Error("Invalid Session");
            }

            if (!ALLOWED_UUIDs.includes(user.id)) {
                throw new Error("User not allowed");
            }
            user_id = user.id;
        }
        catch {
            return NextResponse.json({
                message: "Unauthorized"
            }, {
                status: 401
            })
        }

        const { subject, isHTML, from, to, data } = await req.json();

        const mailtransport = nodemailer.createTransport({
            service: "smtp",
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        })

        let info;
        if (isHTML) {
            info = await mailtransport.sendMail({
                from,
                to,
                subject,
                html: data
            },)
        }
        else {
            info = await mailtransport.sendMail({
                from,
                to,
                subject,
                text: data
            })
        }

        const { error, data: insertData } = await supabase.from("kabootar_emails")
            .insert({
                from,
                to,
                subject,
                body: data,
                user_id
            }).select("id").single();

        if (error) {
            console.log(error);
            return NextResponse.json({
                status: "yellow"
            });
        }

        return NextResponse.json({
            status: "green",
            id: insertData.id
        });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "Something went wrong!"
        }, {
            status: 500
        })
    }

}