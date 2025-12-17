import ActionCard from "@/common/component/ActionCard"
import DynamicStatsCard from "@/common/component/DynamicStatsCard"
import Sidebar from "@/common/component/Sidebar"
import { FilePlus } from "lucide-react"

const page = () => {
  return (
    <div className="flex">
    <Sidebar/>
    <DynamicStatsCard />
    <ActionCard title="Create New Record"   icon={<FilePlus className="w-5 h-5 text-white" />}/>
    </div>
  )
}

export default page
