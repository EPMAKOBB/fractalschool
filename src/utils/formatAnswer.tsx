// src/utils/formatAnswer.tsx
import React from "react";

/**
 * Formats an answer for display. Supports strings, one-dimensional arrays and
 * two-dimensional arrays (rendered as a table).
 */
export function formatAnswer(ans: any): string | React.ReactElement {
  if (Array.isArray(ans)) {
    // two-dimensional array → table
    if (ans.length > 0 && Array.isArray(ans[0])) {
      return (
        <table className="border border-gray-500 rounded my-2">
          <tbody>
            {ans.map((row: any[], i: number) => (
              <tr key={i}>
                {row.map((cell: any, j: number) => (
                  <td key={j} className="px-2 py-1 border border-gray-400">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // one-dimensional array
    return ans.join(", ");
  }
  return String(ans);
}
