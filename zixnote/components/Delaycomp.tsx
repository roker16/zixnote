import { wait } from "@/utils/helper";

// This is an async Server Component
export default async function Delaycomp({ delay }: { delay: number }) {
    await wait(delay)

    return <div>I am here after {delay / 1000} second</div>;
}