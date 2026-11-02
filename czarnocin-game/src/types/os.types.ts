export type WindowAppId =
  | 'case-viewer'
  | 'photo-viewer'
  | 'timeline'
  | 'ksip'
  | 'warrant'
  | 'field-dispatcher'
  | 'mail'
  | 'notepad';

export interface WindowState {
  id: WindowAppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  icon?: string;
}

export type PlayerRank =
  | 'mlodszy_aspirant'
  | 'aspirant'
  | 'podkomisarz'
  | 'komisarz'
  | 'podinspektor';

export interface VirtualClockState {
  dayName: string;
  formattedTime: string;
  budgetHoursLeft: number;
  budgetHoursTotal: number;
  servicePoints: number;
  servicePointsMax: number;
}
