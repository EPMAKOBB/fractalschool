// src/app/components/TaskCard/SolutionBlock.tsx
import { formatAnswer } from "./utils/helpers";
import MdxRender from "../MdxRender";

export default function SolutionBlock({
  open,
  onToggle,
  answer,
  solution,
  solutionMdx,
}: {
  open: boolean;
  onToggle: () => void;
  answer: any;
  solution: string | null;
  solutionMdx?: string | null;
}) {
  return (
    <>
      <button
        className="text-blue-400 underline text-sm"
        onClick={onToggle}
      >
        {open ? "Скрыть решение и ответ" : "Показать решение и ответ"}
      </button>

      {open && (
        <div className="mt-3 bg-gray-900 rounded p-3 text-sm">
          <div>
            <b>Ответ:</b> {formatAnswer(answer)}
          </div>
          {(solutionMdx || solution) && (
            <div className="mt-2">
              <b>Решение:</b>
              {solutionMdx ? (
                <MdxRender source={solutionMdx} />
              ) : (
                <div className="whitespace-pre-line">{solution}</div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
