import Dashboard from '@/components/dashboard/Dashboard'
// import { WhatsappStatus } from '@/components/whatsapp-status'
export default async function Home() {
  return (
    <div className="flex w-full grow flex-col">
      {/* <h1 className="w-full text-center text-2xl font-bold">WELCOME TO LATIN ACACDEMEY</h1>
      <div className="flex w-full justify-center">
        <WhatsappStatus />
      </div> */}
      <Dashboard />
    </div>
  )
}
