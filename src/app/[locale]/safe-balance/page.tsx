import SafeBalanceView from './(components)/safe-balance-view'

export default async function SafeBalancePage() {
  return (
    <div className="flex grow flex-col gap-4">
      <SafeBalanceView />
    </div>
  )
}
