import { TrackerKanban } from "./tracker-kanban";

export const Tracker = () => (
  <div className="flex flex-col gap-4">
    <h2>Applications</h2>
    <TrackerKanban />
  </div>
);
