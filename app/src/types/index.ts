export type JobStatus = 'idle' | 'processing' | 'done' | 'failed';

export type LogoStyle = 'no-style' | 'monogram' | 'abstract' | 'mascot';

export interface Job {
  id: string;
  status: JobStatus;
  prompt: string;
  style: LogoStyle | null;
  imageUrl: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RootStackParamList = {
  Input: undefined;
  Output: { jobId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
