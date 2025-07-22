// src/app/components/AnswerFields.tsx

import { Input } from "@/components/ui/input";


export interface AnswerFieldsProps {
  answerType: "single" | "pair" | "table_10x2" | "pair_partial" | "table_2x2";
  value: any;
  onChange: (val: any) => void;
  disabled?: boolean;
}


export default function AnswerFields({ answerType, value, onChange, disabled }: AnswerFieldsProps) {
  switch (answerType) {

    case "pair":
    case "pair_partial":
  return (
    <div className="flex gap-2">
      <Input
        value={value[0] || ""}
        onChange={e => onChange([e.target.value, value[1] || ""])}
        disabled={disabled}
        placeholder="Ответ 1"
      />
      <Input
        value={value[1] || ""}
        onChange={e => onChange([value[0] || "", e.target.value])}
        disabled={disabled}
        placeholder="Ответ 2"
      />
    </div>
  );

    case "table_10x2":
  // value: string[][]
  // onChange: (val: string[][]) => void
  // disabled: boolean

  // Защита на случай пустого value:
  const safeValue = Array.isArray(value) && value.length === 10
    ? value
    : Array.from({ length: 10 }, () => ["", ""]);
  return (
    <table className="border-collapse my-2">
      <tbody>
        {safeValue.map((pair, rowIdx) => (
          <tr key={rowIdx}>
            <td className="border p-1">
              <Input
                value={pair?.[0] || ""}
                onChange={e =>
                  onChange(
                    safeValue.map((row, idx) =>
                      idx === rowIdx ? [e.target.value, row[1] || ""] : row
                    )
                  )
                }
                disabled={disabled}
                placeholder={`Строка ${rowIdx + 1} — 1`}
              />
            </td>
            <td className="border p-1">
              <Input
                value={pair?.[1] || ""}
                onChange={e =>
                  onChange(
                    safeValue.map((row, idx) =>
                      idx === rowIdx ? [row[0] || "", e.target.value] : row
                    )
                  )
                }
                disabled={disabled}
                placeholder={`Строка ${rowIdx + 1} — 2`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  case "table_2x2":
  // value: string[][]
  // onChange: (val: string[][]) => void
  // disabled: boolean

  // Гарантируем, что value — 2 строки по 2 значения
  const safeValue2x2 = Array.isArray(value) && value.length === 2
    ? value.map(row => Array.isArray(row) && row.length === 2 ? row : ["", ""])
    : [
        ["", ""],
        ["", ""]
      ];

  return (
    <table className="border-collapse my-2">
      <tbody>
        {[0, 1].map(rowIdx => (
          <tr key={rowIdx}>
            {[0, 1].map(colIdx => (
              <td className="border p-1" key={colIdx}>
                <Input
                  value={safeValue2x2[rowIdx][colIdx]}
                  onChange={e => {
                    const newTable = safeValue2x2.map(r => [...r]);
                    newTable[rowIdx][colIdx] = e.target.value;
                    onChange(newTable);
                  }}
                  disabled={disabled}
                  placeholder={`[${rowIdx + 1}, ${colIdx + 1}]`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

    default: // single
  return (
    <Input
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Введите ответ"
    />
  );
  }
}