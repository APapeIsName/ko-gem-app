export interface PlanItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  location?: string;
  isCompleted: boolean;
}

export interface Plan {
  id: string;
  date: string; // YYYY-MM-DD 형식
  items: PlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanFormData {
  title: string;
  description?: string;
  time?: string;
  location?: string;
}
