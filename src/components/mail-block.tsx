import { DisplayMail } from "@/lib/types"
import { Skeleton } from "./ui/skeleton"
import { useRouter } from "next/navigation"

export const MailSkeleton = () => {
    return (<>
        <div className="w-full p-5 flex items-center justify-between gap-3 border-b">
            <Skeleton className="w-3/10 min-w-[200px] h-4" />
            <Skeleton className="w-1/10 h-2" />
        </div>
    </>)

}
interface MailBlockProps {
    mail: DisplayMail
}

export const MailBlock = ({ mail }: MailBlockProps) => {
    const router = useRouter();
    return (<>
        <div className="w-full p-5 flex items-center justify-between gap-3 border-b cursor-pointer hover:bg-primary/20" onClick={()=> {router.push(`/m/${mail.id}`)}} >
            <div className="max-w-8/10 min-w-[200px]">
                <p>{mail.subject}</p>
                <p className="text-xs text-primary/50">To: {mail.to}</p>
            </div>
            <div className="w-1/10 h-2 text-sm text-primary/50" >
                {
                    getFormatedDate(mail.sent_at)
                }
            </div>
        </div>
    </>)
}

const month_array = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const getFormatedDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();

    //if sent today
    if (now.toDateString() == d.toDateString()) {
        const hour = d.getHours();
        return `${hour > 12 ? hour % 12 : hour}:${d.getMinutes()} ${hour > 12 ? "PM" : "AM"}`
    }
    else if (now.getMonth() == d.getMonth() && now.getFullYear() == d.getFullYear()) {
        return `${month_array[d.getMonth()]} ${d.getDate()}`
    }
    else {
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    }
}