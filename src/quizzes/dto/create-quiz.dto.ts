export type QuestionType = 'boolean' | 'input' | 'checkbox';

export class CreateQuestionDto {
  text: string;
  type: QuestionType;
  options?: string[];
}

export class CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}

