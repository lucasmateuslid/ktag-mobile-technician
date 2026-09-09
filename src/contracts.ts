export type ScheduleStatus = 'ABERTA' | 'AGENDADA' | 'EM DESLOCAMENTO' | 'NO LOCAL' | 'EM EXECUÇÃO' | 'AGUARDANDO VÍNCULO' | 'CONCLUÍDA' | 'VALIDADA' | 'Cancelada' | 'Frustrada' | 'Reagendada';
export type ChecklistStatus = 'OK' | 'N/OK' | 'N/A' | '';

export interface ChecklistItem {
  id?: string;
  name: string;
  before: ChecklistStatus;
  after: ChecklistStatus;
  beforePhoto?: string;
  afterPhoto?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  version?: number;
  status: ScheduleStatus;
  osNumber?: string;
  clientName?: string;
  clientPhone?: string;
  vehiclePlate: string;
  vehicleModel: string;
  deviceType: string;
  serviceType: string;
  locationAddress: string;
  confirmedDate?: string;
  confirmedTime?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  checklist?: ChecklistItem[];
  installedImei?: string;
  installedTagImei?: string;
  technicianPaymentAmount?: number;
  technicianPaid?: boolean;
  technicianInvoiceId?: string;
  updatedAt?: number;
}

export interface InventoryItem { id: string; technicianId: string; type: string; imei: string; status: string; scheduleId?: string; updatedAt?: number }
export interface TechnicianPayment { id: string; amount: number; date: number; proofUrl?: string; scheduleIds: string[]; status: string }
export interface TechnicianInvoice { id: string; number: string; issueDate: string; amount: number; scheduleIds: string[]; attachmentIds: string[]; status: 'submitted' | 'approved' | 'rejected' | 'superseded'; rejectionReason?: string; updatedAt: number }
export interface SyncPayload { cursor: number; profile: any; technician: any; schedules: Schedule[]; inventory: InventoryItem[]; payments: TechnicianPayment[]; invoices: TechnicianInvoice[]; notifications: any[] }
export interface MobileCommand { commandId: string; type: 'schedule.status' | 'schedule.checklist' | 'schedule.complete'; entityId: string; baseVersion?: number; createdAt: number; payload: Record<string, unknown> }

export const defaultChecklist = [
  'Partida elétrica', 'Setas', 'Pisca alerta', 'Farol baixo', 'Farol alto', 'Lanterna',
  'Luz de freio', 'Buzina', 'Iluminação do painel', 'Luzes de painel', 'Limpadores',
  'Ar condicionado', 'Vidro elétrico', 'Iluminação cortesia', 'Rádio/CD/MP3', 'Luz de ré',
  'Trava elétrica', 'Bloqueio', 'Retrovisor elétrico', 'Teto solar', 'Desembaçador traseiro', 'Câmera de ré',
].map((name, index) => ({ id: `item-${index + 1}`, name, before: '' as ChecklistStatus, after: '' as ChecklistStatus }));
