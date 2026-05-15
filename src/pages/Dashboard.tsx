import { useEffect, useState } from 'react'
import { Scale, Package, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

function fmt(n: number, d = 2) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const [rolls, setRolls] = useState<any[]>([])

  useEffect(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    supabase.from('production_rolls')
      .select('*')
      .eq('roll_type', 'good')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .then(({ data }) => setRolls(data ?? []))
  }, [])

  const totalRolls = rolls.length
  const totalKg    = rolls.reduce((s, r) => s + (r.weight ?? 0), 0)
  const avgKg      = totalRolls > 0 ? totalKg / totalRolls : 0

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">สรุปยอดชั่งวันนี้</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Scale,   label: 'ม้วนวันนี้',  value: totalRolls,      unit: 'ม้วน', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
          { icon: Package, label: 'น้ำหนักรวม', value: fmt(totalKg, 1), unit: 'kg',   color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20'  },
          { icon: Clock,   label: 'เฉลี่ย/ม้วน', value: fmt(avgKg, 2), unit: 'kg',   color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20'  },
        ].map(({ icon: Icon, label, value, unit, color, bg }) => (
          <div key={label} className={`border rounded-2xl p-5 ${bg}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className={`text-4xl font-black mt-1 ${color}`}>{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{unit}</p>
              </div>
              <Icon size={22} className={`${color} opacity-50`} />
            </div>
          </div>
        ))}
      </div>

      {/* ตารางม้วนวันนี้ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800">
          <p className="text-white font-semibold text-sm">ม้วนทั้งหมดวันนี้</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                {['เวลา', 'ม้วนที่', 'สุทธิ (kg)', 'ดิบ (kg)', 'แกน (kg)'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {rolls.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30">
                  <td className="px-5 py-3 text-slate-400 text-xs">{fmtTime(r.created_at)}</td>
                  <td className="px-5 py-3 text-white font-mono font-bold">#{r.roll_no}</td>
                  <td className="px-5 py-3 text-brand-300 font-black text-base">{fmt(r.weight)}</td>
                  <td className="px-5 py-3 text-slate-400">{fmt(r.gross_weight ?? 0)}</td>
                  <td className="px-5 py-3 text-slate-500">{fmt(r.core_weight ?? 0)}</td>
                </tr>
              ))}
              {rolls.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-slate-600">ยังไม่มีข้อมูลวันนี้</td></tr>
              )}
            </tbody>
            {rolls.length > 0 && (
              <tfoot>
                <tr className="border-t border-slate-700 bg-slate-800/30">
                  <td colSpan={2} className="px-5 py-3 text-slate-400 text-sm font-semibold">รวม {totalRolls} ม้วน</td>
                  <td className="px-5 py-3 text-brand-300 font-black">{fmt(totalKg)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
