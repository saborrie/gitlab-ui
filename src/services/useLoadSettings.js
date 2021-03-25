import YAML from "yaml";
import useLoadFile from "./useLoadFile";

export default function useLoadSettings(projectId) {
  function formatProjectId(id) {
    return Number(id.slice("gid://gitlab/Project/".length));
  }

  const query = useLoadFile(projectId && formatProjectId(projectId), ".storymap-settings.yml");

  if (!query.data) return null;
  try {
    return YAML.parse(query.data);
  } catch {
    return null;
  }
}
