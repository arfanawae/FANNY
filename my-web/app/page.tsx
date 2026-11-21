import Image from "next/image";
import Link from "next/link";
import Input from "@/components/Greeting";


export default function Home() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Link href="/count" className="text-green-500 underline">
                    ไปหน้าปุ่มนับเลข
                </Link>
                <Input name="Fan"></Input>
                <Input name="Fan"></Input>
            </main>
        </div>
    );
}