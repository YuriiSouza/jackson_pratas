import Layout from "@/components/layout"
import { useSession } from "next-auth/react"

export default function Home() {
    const {data: session} = useSession();


    return <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1">
          <img src={session?.user?.image} alt="" className="w-8 h-8"></img>
          <span className="py-1 px-2">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
}
