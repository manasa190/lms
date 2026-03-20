import { useState } from 'react';
import { db } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizViewProps {
  quizId: string;
  onComplete: () => void;
}

const QuizView = ({ quizId, onComplete }: QuizViewProps) => {
  const quiz = db.quizzes.find(q => q.id === quizId);
  const { user } = useAuth();
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz || !user) return <p className="text-muted-foreground">Quiz not found</p>;

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const s = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);
    setScore(s);
    setSubmitted(true);

    db.quizAttempts = [...db.quizAttempts, {
      id: crypto.randomUUID(), userId: user.id, quizId: quiz.id,
      score: s, total: quiz.questions.length, answers,
      attemptedAt: new Date().toISOString().split('T')[0],
    }];

    if (s === quiz.questions.length) onComplete();
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-foreground">{quiz.title}</h3>

      {quiz.questions.map((q, qi) => (
        <div key={q.id} className="p-4 rounded-lg bg-muted/50 space-y-3">
          <p className="font-medium text-foreground">{qi + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              let cls = 'border-border hover:border-primary/30';
              if (submitted && oi === q.correctAnswer) cls = 'border-success bg-success/10';
              else if (submitted && answers[qi] === oi && oi !== q.correctAnswer) cls = 'border-destructive bg-destructive/10';
              else if (answers[qi] === oi) cls = 'border-primary bg-primary/5';

              return (
                <button key={oi} onClick={() => handleAnswer(qi, oi)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${cls} text-foreground`}>
                  {opt}
                  {submitted && oi === q.correctAnswer && <CheckCircle className="w-4 h-4 text-success inline ml-2" />}
                  {submitted && answers[qi] === oi && oi !== q.correctAnswer && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={answers.length < quiz.questions.length}
          className="gradient-primary text-primary-foreground">
          Submit Quiz
        </Button>
      ) : (
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-lg font-display font-bold text-foreground">
            Score: {score}/{quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)
          </p>
          {score === quiz.questions.length && <p className="text-sm text-success mt-1">Perfect! Lesson marked as complete.</p>}
          {score < quiz.questions.length && <p className="text-sm text-muted-foreground mt-1">Review the answers and try again next time.</p>}
        </div>
      )}
    </div>
  );
};

export default QuizView;
