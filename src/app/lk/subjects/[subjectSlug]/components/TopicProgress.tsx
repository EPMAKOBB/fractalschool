// src/app/lk/subjects/[subjectSlug]/components/TopicProgress.tsx
import ProgressBar from "../../../components/ProgressBar";

interface Props {
  topicName: string;
  accuracy: number; // 0–1
}

export default function TopicProgress({ topicName, accuracy }: Props) {
  return (
    <div>
      <ProgressBar
        value={Math.round(accuracy * 100)}
        label={topicName}
        className="w-full"
      />
    </div>
  );
}
