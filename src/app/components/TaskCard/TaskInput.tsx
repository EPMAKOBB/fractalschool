// src/app/components/TaskCard/TaskInput.tsx
import type { UserAnswer } from "./utils/helpers";

/** Свитчер всех форм ввода по answerType. */
export default function TaskInput({
  answerType,
  answer,
  onChange,
  disabled,
}: {
  answerType: string;
  answer: UserAnswer;
  onChange: (a: UserAnswer) => void;
  disabled?: boolean;
}) {
  switch (answerType) {
    case "pair":
    case "pair_partial":
      return (
        <div className="flex gap-2">
          {[0, 1].map(idx => (
            <input
              key={idx}
              className="border rounded px-2 py-1"
              value={(answer as string[])[idx] ?? ""}
              onChange={e => {
                const next = [...(answer as string[])];
                next[idx] = e.target.value;
                onChange(next);
              }}
              disabled={disabled}
            />
          ))}
        </div>
      );

    case "table_2x2":
    case "table_10x2": {
      const rows = answerType === "table_2x2" ? 2 : 10;
      return (
        <table className="border border-gray-500 rounded mb-2">
          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {[0, 1].map(c => (
                  <td key={c} className="p-1">
                    <input
                      className="border rounded px-2 py-1 w-16"
                      value={(answer as string[][])[r]?.[c] ?? ""}
                      onChange={e => {
                        const next = (answer as string[][]).map(row => [
                          ...row,
                        ]);
                        next[r][c] = e.target.value;
                        onChange(next);
                      }}
                      disabled={disabled}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    default:
      return (
        <input
          className="border rounded px-2 py-1 w-full"
          value={(answer as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          placeholder="Ваш ответ"
          disabled={disabled}
        />
      );
  }
}
