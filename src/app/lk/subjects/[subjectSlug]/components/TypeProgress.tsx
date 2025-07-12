// src/app/lk/subjects/[subjectSlug]/components/TypeProgress.tsx
import ProgressBar from "../../../components/ProgressBar";
import TopicProgress from "./TopicProgress";

interface SubtypeRow {
  topic_id: string;
  topic_name: string;
  accuracy: number;
}

interface Props {
  typeNum: number;
  accuracy: number; // 0–1
  subtypeRows: SubtypeRow[];
}

export default function TypeProgress({ typeNum, accuracy, subtypeRows }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 font-medium">Тип {typeNum}</h3>
      <ProgressBar value={Math.round(accuracy * 100)} />

      {subtypeRows.length ? (
        <div className="mt-3 space-y-2 pl-4">
          {subtypeRows.map((st) => (
            <TopicProgress
              key={st.topic_id}
              topicName={st.topic_name}
              accuracy={st.accuracy}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
