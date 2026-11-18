import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface OrderItem {
  id: string | number
  title: string
  customer?: string
  status: 'Completed' | 'Pending' | 'In Progress'
  amount: number
  created_at?: string
}

const MOCK_DATA: OrderItem[] = [
  { id: 'ORD-1001', title: 'Task Card Inspection A320', customer: 'Thai Airways', status: 'Completed', amount: 15400, created_at: '2026-11-15' },
  { id: 'ORD-1002', title: 'Avionics System Check', customer: 'Bangkok Airways', status: 'In Progress', amount: 32000, created_at: '2026-11-16' },
  { id: 'ORD-1003', title: 'Landing Gear Overhaul', customer: 'Nok Air', status: 'Pending', amount: 48500, created_at: '2026-11-17' },
  { id: 'ORD-1004', title: 'Hydraulic Seal Replacement', customer: 'AirAsia', status: 'Completed', amount: 9200, created_at: '2026-11-18' },
]

export default async function DashboardPage() {
  let displayData: OrderItem[] = MOCK_DATA
  let dataSource = 'Mock Data (ตัวอย่าง)'
  let dbError: string | null = null

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (error) {
        dbError = error.message
      } else if (data && data.length > 0) {
        displayData = data as OrderItem[]
        dataSource = 'Supabase Database (ข้อมูลจริง)'
      } else {
        dataSource = 'Supabase เชื่อมต่อสำเร็จ (ตาราง orders ยังไม่มีข้อมูล จึงแสดง mock)'
      }
    } catch (e: any) {
      dbError = e.message
    }
  }

  const totalAmount = displayData.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const completedCount = displayData.filter((i) => i.status === 'Completed').length
  const pendingCount = displayData.filter((i) => i.status !== 'Completed').length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white px-8 py-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operations Dashboard</h1>
            <p className="text-sm text-slate-500">GitHub + Supabase + Vercel Starter</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-2 h-2 mr-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              {dataSource}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {dbError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <strong>Supabase Error:</strong> {dbError}
          </div>
        )}

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Value</p>
            <p className="text-2xl font-bold mt-2 text-slate-800">฿{totalAmount.toLocaleString()}</p>
            <span className="text-xs text-emerald-600 font-medium">รวมยอดรายการทั้งหมด</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Items</p>
            <p className="text-2xl font-bold mt-2 text-slate-800">{displayData.length}</p>
            <span className="text-xs text-slate-500">จำนวนรายการในระบบ</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold mt-2 text-emerald-600">{completedCount}</p>
            <span className="text-xs text-slate-500">รายการที่เสร็จแล้ว</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending / In Progress</p>
            <p className="text-2xl font-bold mt-2 text-amber-600">{pendingCount}</p>
            <span className="text-xs text-slate-500">รายการที่รอดำเนินการ</span>
          </div>
        </section>

        {/* Data Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Records</h2>
              <p className="text-xs text-slate-500">ตารางแสดงรายการข้อมูลล่าสุด</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Title / Task</th>
                  <th className="px-6 py-3.5">Customer / Entity</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-medium text-slate-900">{row.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{row.title}</td>
                    <td className="px-6 py-4 text-slate-500">{row.customer || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                      ฿{Number(row.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Connection Guide */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-sm">
          <h3 className="font-semibold text-blue-950 text-base mb-2">วิธีเชื่อมต่อฐานข้อมูล Supabase และ Deploy ขึ้น Vercel</h3>
          <ol className="list-decimal list-inside space-y-1.5 text-blue-900">
            <li>ใส่ <strong>Project URL</strong> และ <strong>anon public key</strong> จาก Supabase ลงในไฟล์ <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-xs">.env.local</code></li>
            <li>สร้างตารางชื่อ <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-xs">orders</code> ใน Supabase (columns: <code className="text-xs">id, title, customer, status, amount</code>)</li>
            <li>ติดตั้ง Git และ push โปรเจกต์นี้ขึ้น GitHub Repo</li>
            <li>กด Import Repo ใน Vercel แล้วใส่ Environment Variables สองตัวเดิม พร้อมใช้งานจริงทันที!</li>
          </ol>
        </section>
      </main>
    </div>
  )
}
