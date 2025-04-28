export interface TaskOutput {
  task_number: number;
  task_name: string;
  task_output: string;
}

export interface AnalysisResult {
  tasks: TaskOutput[];
  result_summary: string;
  analysis_text: string;
  url: string;
  timestamp: number;
}

export interface AnalysisResponse {
  analysis_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  message: string;
  check_status_url: string;
}

export interface StatusResponse {
  analysis_id: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  created_at: number;
  completed_at?: number;
  error?: string;
  result_url?: string;
}

export interface ResultsResponse {
  analysis_id: string;
  url: string;
  status: 'completed';
  created_at: number;
  completed_at: number;
  result: AnalysisResult;
}