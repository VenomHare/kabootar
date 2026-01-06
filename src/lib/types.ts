import z from 'zod' 
export interface DisplayMail { 
    id: string,
    from : string,
    to: string,
    subject: string,
    sent_at: string
}
export interface MailData extends DisplayMail { 
    body: string,
}

export const SendMailRequestBody = z.object({
    to: z.email(),
    from: z.email(),
    senderName: z.string().min(1),
    subject: z.string(),
    isHTML: z.boolean(),
    data: z.string()
})