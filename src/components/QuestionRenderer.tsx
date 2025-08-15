// components/QuestionRenderer.tsx
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { Question } from '../types/survey';
import { TextQuestion } from './questions/TextQuestion';
import { SingleChoiceQuestion } from './questions/SingleChoiceQuestion';
import { RatingQuestion } from './questions/RatingQuestion';

interface QuestionRendererProps {
  question: Question;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const QuestionRenderer = ({ question, register, setValue, watch }: QuestionRendererProps) => {
  switch (question.type) {
    case 'text':
    case 'number':
      return <TextQuestion question={question} register={register} />;
    
    case 'single_choice':
      return <SingleChoiceQuestion 
        question={question} 
        register={register} 
        setValue={setValue} 
        watch={watch} 
      />;
    
    case 'rating':
      return <RatingQuestion question={question} register={register} />;
    
    default:
      return null;
  }
};
