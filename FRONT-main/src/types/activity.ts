export type ActivityCategory = 'อาสาสมัคร' | 'กิจกรรมช่วยงาน' | 'ฝึกอบรม';
export type ActivityStatus = 'รออนุมัติ' | 'อนุมัติ' | 'ปฏิเสธ' | 'เสร็จสิ้น' | 'ยกเลิก';
export type ApplicationStatus = 'รอดำเนินการ' | 'อนุมัติ' | 'ปฏิเสธ';

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants?: number;
  status: ActivityStatus;
  is_registered?: boolean;
  cover_image: string | null;
}

export interface ActivityParticipation {
  id: number;
  activity_id: number;
  user_id: number;
  hours: number;
  points: number;
  verified_by: number | null;
  verified_at: string | null;
}

export interface ActivityApplication {
  id: number;
  activity_id: number;
  user_id: number;
  status: ApplicationStatus;
  applied_at: string;
  approved_by: number | null;
}

export interface ActivityDetail extends Activity {
  isRegistered?: boolean;
  current_participants?: number;
  faculty_name?: string;
  major_name?: string;
  creator_name?: string;
}

export interface ActivitySummary {
  total_activities: number;   // จำนวนกิจกรรมทั้งหมด
  total_hours: number;        // จำนวนชั่วโมงสะสม
  total_points: number;       // คะแนนสะสม
}

export interface ActivityFilterParams {
  page?: number;
  limit?: number;
  category?: ActivityCategory;
  status?: ActivityStatus;
  search?: string;
  start_date?: string;
  end_date?: string;
  faculty_id?: number;
  major_id?: number;
}

export interface Applicant {
  id: number;
  user_id: number;
  activity_id: number;
  status: ApplicationStatus;
  applied_at: string;
  firstname: string;
  lastname: string;
  student_id: string;
  faculty_name?: string;
  major_name?: string;
}

export interface ActivityPayload {
  title: string;
  description: string;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  max_participants: number;
  cover_image?: string | null;
}


