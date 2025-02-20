export interface TestResults {
  score: number;
  details: {
    output: string;
    passed: boolean;
  };
  errors?: string[];
}

export interface AIReview {
  overall_score: number;
  categories: {
    code_quality: number;
    best_practices: number;
    error_handling: number;
    documentation: number;
    architecture: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    critical_issues: string[];
  };
}
