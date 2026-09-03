import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatTimeAgo(dateString) {
  return dayjs(dateString).fromNow();
}
