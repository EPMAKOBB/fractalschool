// src/app/components/TaskCard/SolutionBlock.tsx
import { formatAnswer } from "./utils/helpers";
import MDX from "../TaskComponents/MDX";
import TaskTable from "../TaskComponents/TaskTable";
import { SimpleSVG } from "../TaskComponents/SimpleSVG";
import TaskImage from "../TaskComponents/TaskImage";

export default function SolutionBlock({
  open,
  onToggle,
  answer,
  solution,
  solutionMdx,
  tables,
  svgs,
  images,
}: {
  open: boolean;
  onToggle: () => void;
  answer: any;
  solution?: string | null;
  solutionMdx?: string | null;
  tables?: (string | number)[][][];
  svgs?: {
    width: number;
    height: number;
    elements: import("../TaskComponents/SimpleSVG").SvgElement[];
  }[];
  images?: { src: string; alt?: string }[];
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
          {solutionMdx ? (
            <div className="mt-2">
              <b>Решение:</b>
              <MDX
                code={solutionMdx}
                components={{ TaskTable, SimpleSVG, TaskImage }}
                scope={{ tables, svgs, images }}
              />
            </div>
          ) : (
            solution && (
              <div className="mt-2">
                <b>Решение:</b>
                <div className="whitespace-pre-line">{solution}</div>
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}
