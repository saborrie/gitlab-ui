import React from "react";
import { Link } from "react-router-dom";
import { useGetMyProjects } from "../services/projectList";
import ListItem from "../components/ListItem";
import List from "../components/List";
import Loader from "../components/Loader";
import Logo from "../components/Logo";

import { useInfiniteQueryGraphProjects } from "../services/project";

function HomePage() {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQueryGraphProjects();

  React.useEffect(() => {
    function handleScroll(event) {
      if (window.scrollY + document.body.clientHeight >= document.body.scrollHeight) {
        fetchNextPage();
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) {
    return <div>error.</div>;
  }

  return (
    <List>
      <Logo />
      <h1>Projects</h1>
      {data?.pages?.map((page) =>
        page.nodes.map((project) => (
          <ListItem component={Link} to={`/project/${project.fullPath}`}>
            <ListItem.Title>{project.name}</ListItem.Title>
            <small>
              <br />({project.fullPath})
            </small>
          </ListItem>
        ))
      )}
      {/* <div>
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? <Loader /> : null}</div>{" "} */}
      <div>{isFetching ? <Loader /> : null}</div>
    </List>
  );
}

export default HomePage;
