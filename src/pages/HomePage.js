import React from "react";
import { Link } from "react-router-dom";
import { useGetMyProjects } from "../services/projectList";

function HomePage() {
  const myProjectsQuery = useGetMyProjects();

  if (myProjectsQuery.isLoading) {
    return <div>loading...</div>;
  }

  if (myProjectsQuery.error) {
    return <div>error.</div>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {myProjectsQuery.data?.map((project) => (
          <li>
            <Link to={`/project/${project.path_with_namespace}`}>
              {project.name_with_namespace}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
