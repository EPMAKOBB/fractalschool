// src/app/components/TaskCard/index.tsx

"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type {
  Task,
  UserAnswer,
  TaskCardProps,
  VariantModeProps,
} from "./utils/helpers";
import { getInitialAnswer } from "./utils/helpers";
import { checkAnswer } from "@/utils/checkAnswer";
import TaskHead from "./TaskHead";
import TaskStatement from "./TaskStatement";
import TaskInput from "./TaskInput";
import SingleControls from "./SingleControls";
import SolutionBlock from "./SolutionBlock";
import MDX from "../TaskComponents/MDX";
import TaskTable from "../TaskComponents/TaskTable";
import { SimpleSVG } from "../TaskComponents/SimpleSVG";
import TaskImage from "../TaskComponents/TaskImage";

/** Карточка-обёртка: выбирает режим single / variant. */
export default function TaskCard(props: TaskCardProps) {
  const { task, subject } = props;
  const answerType = task.answer_type ?? "single";

  // SINGLE MODE
  if (props.mode === "single") {
    const { maxScore = 1 } = task;
    const [userAnswer, setUserAnswer] = useState<UserAnswer>(getInitialAnswer(answerType));
    const [score, setScore] = useState<number | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    const handleCheck = () => {
      const { score } = checkAnswer({
        answerType,
        correctAnswer: task.answer_json,
        userAnswer,
        maxScore,
      });
      setScore(score);
    };

    return (
      <Card className="mb-4">
        <CardContent className="space-y-4">
          <TaskHead task={task} subject={subject} />


          {task.body_mdx ? (
            <MDX
              code={task.body_mdx}
              components={{ TaskTable, SimpleSVG, TaskImage }}
              scope={{ tables: task.tables, svgs: task.svgs, images: task.images }}
            />
          ) : (
            <TaskStatement html={task.body_md} />
          )}


          <TaskInput
            answerType={answerType}
            answer={userAnswer}
            onChange={setUserAnswer}
          />
          <SingleControls
            onCheck={handleCheck}
            score={score}
            maxScore={maxScore}
          />
          <SolutionBlock
            open={showSolution}
            onToggle={() => setShowSolution(s => !s)}
            answer={task.answer_json}

            solution={task.solution_md}

            solutionMdx={task.solution_mdx ?? undefined}
            tables={task.tables}
            svgs={task.svgs}
            images={task.images}


          />
        </CardContent>
      </Card>
    );
  }

  // VARIANT MODE
  const { value, onChange, disabled } = props as VariantModeProps;

  return (
    <Card
      className={`mb-4 ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <CardContent className="space-y-4">
        <TaskHead task={task} subject={subject} />


        {task.body_mdx ? (
          <MDX
            code={task.body_mdx}
            components={{ TaskTable, SimpleSVG, TaskImage }}
            scope={{ tables: task.tables, svgs: task.svgs, images: task.images }}
          />
        ) : (
          <TaskStatement html={task.body_md} />
        )}


        <TaskInput
          answerType={answerType}
          answer={value}
          onChange={onChange}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}
