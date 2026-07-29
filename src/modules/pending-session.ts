import type { Session } from "../types";
import { pathEqualOrNested } from "./platform-paths";

export type PendingSessionMatch = {
  workspacePath: string;
  baselineIds: Set<string>;
  linkedSessionId?: string;
};

export function findPendingSession(
  pending: PendingSessionMatch,
  sessions: Session[],
  claimedSessionIds: Set<string>,
): Session | undefined {
  const candidates = sessions.filter((session) => (
    !pending.baselineIds.has(session.id)
    && !claimedSessionIds.has(session.id)
  ));
  if (candidates.length === 0) return undefined;
  const workspaceCandidates = candidates.filter((session) => (
    !session.cwd || pathEqualOrNested(session.cwd, pending.workspacePath)
  ));
  return (workspaceCandidates.length > 0 ? workspaceCandidates : candidates)
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))[0];
}
