import React from "react";
import Layout from "../components/Layout";
import Logo from "../components/Logo";
import AddButton from "../components/AddButton";

import { useSavedProjects } from "../services/storage";
import SidebarProjectButton from "./SidebarProjectButton";
import SystemIcons from "../components/SystemIcons";

function Sidebar() {
  const savedProjects = useSavedProjects();

  return (
    <Layout.Sidebar>
      <Logo />
      {savedProjects?.map((fullPath) => (
        <SidebarProjectButton fullPath={fullPath} />
      ))}
      <AddButton to="/add">
        <SystemIcons name="plus" />
      </AddButton>
    </Layout.Sidebar>
  );
}

export default Sidebar;
