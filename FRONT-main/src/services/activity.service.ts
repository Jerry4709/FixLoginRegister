import axios from './axios'
import type {
  Activity,
  ActivityDetail,
  ActivityFilterParams,
  ActivitySummary,
  Applicant,
  ActivityPayload,
  // ActivityStatus,
  // ApplicationStatus
} from '@/types/activity'
import type { PaginatedData } from '@/types/pagination'

export const activityService = {
  // ───────── Public / Student ─────────

  /** ดึงกิจกรรมที่สมัครแล้ว (approved) */
  async getApproved(params: ActivityFilterParams): Promise<{ items: Activity[]; total: number }> {
    const res = await axios.get('/activities', { 
      params: {
        ...params,
        status: 'อนุมัติ'
      } 
    });
    return {
      items: res.data.data || [],
      total: res.data.total || 0
    };
  },

  /** ดึงกิจกรรมทั้งหมด (พร้อม pagination) */
  async getAll(params: ActivityFilterParams): Promise<PaginatedData<Activity>> {
    const res = await axios.get('/activities', { params })
    return res.data
  },

  /** ดึงรายละเอียดกิจกรรม */
  async getById(id: string): Promise<ActivityDetail> {
    const res = await axios.get(`/activities/${id}`)
    return res.data
  },

  /** toggle สมัคร/ยกเลิกสมัคร */
  async toggleRegistration(id: number): Promise<{ success: boolean }> {
    const res = await axios.post(`/activities/${id}/apply`);
    return {
      success: res.data.success
    };
  },

  /** ดึงกิจกรรมของตัวเอง (My Activities) */
  async getMyActivities(): Promise<Activity[]> {
    const res = await axios.get('/activities/my')
    return res.data
  },

  /** สรุปภาพรวม Student */
  async getMySummary(): Promise<ActivitySummary> {
    const res = await axios.get<{
      success: boolean;
      data: {
        total_hours: string;
        total_points: string;
      }
    }>('/auth/me');

    if (!res.data.success) {
      throw new Error('ไม่สามารถดึงข้อมูลสรุปได้');
    }

    return {
      total_activities: 0, // ถ้าต้องการข้อมูลนี้ต้องเพิ่ม API endpoint ใหม่
      total_hours: Number(res.data.data.total_hours) || 0,
      total_points: Number(res.data.data.total_points) || 0
    };
  },

  // ───────── Staff ─────────

  /** สรุปภาพรวม Staff */
  async getStaffSummary(): Promise<{
    totalActivities: number
    pendingApprovals: number
    upcomingActivities: number
  }> {
    const res = await axios.get('/activities/staff/summary')
    return res.data
  },

  /** สร้างกิจกรรม */
  async create(data: ActivityPayload): Promise<ActivityDetail> {
    const res = await axios.post('/activities', data)
    return res.data
  },

  /** แก้ไขกิจกรรม */
  async update(id: string, data: ActivityPayload): Promise<ActivityDetail> {
    const res = await axios.put(`/activities/${id}`, data)
    return res.data
  },

  /** ดึงผู้สมัครกิจกรรม */
  async getApplicants(activityId: string): Promise<Applicant[]> {
    const res = await axios.get(`/activities/${activityId}/applicants`)
    return res.data
  },

  /** อนุมัติผู้สมัคร */
  async approveApplicant(activityId: number, applicantId: number): Promise<{ success: boolean }> {
    const res = await axios.post(
      `/activities/${activityId}/applicants/${applicantId}/approve`
    )
    return res.data
  },

  /** ปฏิเสธผู้สมัคร */
  async rejectApplicant(activityId: number, applicantId: number): Promise<{ success: boolean }> {
    const res = await axios.post(
      `/activities/${activityId}/applicants/${applicantId}/reject`
    )
    return res.data
  },

  // ───────── Admin ─────────

  /** สรุปภาพรวม Admin */
  async getAdminSummary(): Promise<{
    totalUsers: number
    totalActivities: number
    pendingActivities: number
  }> {
    const res = await axios.get('/admin/summary')
    return res.data
  },

  /** ดึงกิจกรรมที่รออนุมัติ (Admin) */
  async getPendingActivities(): Promise<Activity[]> {
    const pageAll = await this.getAll({ 
      page: 1, 
      limit: 9999, 
      status: 'รออนุมัติ' // แก้จาก 'PENDING' เป็น 'รออนุมัติ'
    })
    return pageAll.items
  },

  /** อนุมัติกิจกรรม (Admin) */
  async approveActivity(id: number): Promise<void> {
    await axios.post(`/activities/${id}/approve`)
  },

  /** ปฏิเสธกิจกรรม (Admin) */
  async rejectActivity(id: number): Promise<void> {
    await axios.post(`/activities/${id}/reject`)
  },
}
