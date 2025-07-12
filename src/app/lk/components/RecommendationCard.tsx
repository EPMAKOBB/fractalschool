// src/app/lk/components/RecommendationCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressBar from "./ProgressBar";

interface Props {
  topicName: string;
  accuracy: number; // 0-1
  onGenerate: () => void;
}

export default function RecommendationCard({ topicName, accuracy, onGenerate }: Props) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">{topicName}</h3>
        <ProgressBar value={Math.round(accuracy * 100)} label="Точность" />
        <Button onClick={onGenerate} className="w-full">
          Сгенерировать задачу
        </Button>
      </CardContent>
    </Card>
  );
}
