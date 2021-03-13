import React from "react";
import { Link } from "react-router-dom";
import { useGetMyProjects } from "../services/projectList";
import ListItem from "../components/ListItem";
import List from "../components/List";
import Loader from "../components/Loader";
import Logo from "../components/Logo";

import { useInfiniteQueryGraphProjects } from "../services/project";
import { useAddProject } from "../services/storage";
import Layout from "../components/Layout";
import useDebounce from "../utils";
import InvisibleInput from "../components/InvisibleInput";

function HomePage() {
  const [search, setSearch] = React.useState();

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQueryGraphProjects(debouncedSearch || null);

  React.useEffect(() => {
    function handleScroll(event) {
      if (window.scrollY + document.body.clientHeight >= document.body.scrollHeight) {
        fetchNextPage();
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addProject = useAddProject();

  if (error) {
    return <div>error.</div>;
  }

  return (
    <Layout.Root>
      <Layout.Topbar>
        <InvisibleInput
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="search projects"
          autoFocus
          style={{ flexGrow: 1 }}
        />
      </Layout.Topbar>
      <Layout.Content>
        <List>
          {data?.pages?.map((page) =>
            page.nodes.map((project) => (
              <ListItem
                component={Link}
                onClick={() => addProject(project.fullPath)}
                to={`/project/${project.fullPath}`}
              >
                <ListItem.Title>{project.name}</ListItem.Title>
                <small>({project.fullPath})</small>
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
      </Layout.Content>
    </Layout.Root>
  );
}

export default HomePage;
