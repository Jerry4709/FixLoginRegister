import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { usePaginate } from '@/hooks/usePaginate'
import { activityService } from '@/services/activity.service'
import type { Activity } from '@/types/activity'

export default function AdminActivityList() {
  const navigate = useNavigate()
  const { page, limit, setPage } = usePaginate()
  const [data, setData] = useState<{ items: Activity[]; total: number }>({
    items: [],
    total: 0,
  })

  useEffect(() => {
    activityService.getAll({ page, limit }).then(setData)
  }, [page, limit])

  return (
    <main className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-semibold">กิจกรรมทั้งหมด</h2>
      <DataTable<Activity>
        columns={[
          { title: 'ชื่อกิจกรรม', key: 'title' },
          { 
            title: 'ประเภท', 
            key: 'category',
            render: (a) => (
              <span className="px-2 py-1 rounded-full text-sm bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-100">
                {a.category}
              </span>
            )
          },
          {
            title: 'วันที่',
            key: 'start_time',
            render: (a) => (
              `${new Date(a.start_time).toLocaleDateString('th-TH')} – 
               ${new Date(a.end_time).toLocaleDateString('th-TH')}`
            )
          },
          { 
            title: 'สถานะ', 
            key: 'status',
            render: (a) => (
              <span className={`px-2 py-1 rounded-full text-sm ${
                a.status === 'อนุมัติ' ? 'bg-green-100 text-green-800' :
                a.status === 'รออนุมัติ' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {a.status}
              </span>
            )
          },
          {
            title: 'Actions',
            key: 'id',
            render: (a) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/admin/activities/${a.id}`)}
                >
                  รายละเอียด
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/activities/${a.id}/edit`)}
                >
                  แก้ไข
                </Button>
              </div>
            ),
          },
        ]}
        data={data.items}
        className="bg-white rounded-xl shadow"
      />
      <Pagination page={page} total={data.total} limit={limit} onChange={setPage} />
    </main>
  )
}
