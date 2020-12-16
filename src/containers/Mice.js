import React from "react";
import { update, exit, useCollaborateState } from "../services/collaborate";

const colors = [
  "#f44747",
  "#5DD8B7",
  "#E5CD52",
  "#79D9F1",
  "#b267e6",
  "#FF8A54",
  "#fafafc",
  "#1c1d21",
  "#EB3D54",
  "#1d6608",
  "#cd9731",
  "#4FB4D8",
  "#9b37e2",
  "#00DCDC",
  "#CBCDD2",
];

function Mouse({ x, y, fill }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      viewBox="0 0 512.019 512.019"
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: 26,
        height: 26,
        enableBackground: "new 80 0 512.019 512.019",
      }}
    >
      <path
        style={{ fill }}
        d="M434.219,344.467L92.885,3.134C88.725-1.037,81.971-1.046,77.8,3.115  c-2.011,2.006-3.139,4.731-3.134,7.571v490.667c0.003,4.382,2.685,8.316,6.763,9.92c4.081,1.603,8.727,0.545,11.712-2.667  l135.509-145.92h198.016c5.891,0.011,10.675-4.757,10.686-10.648C437.358,349.198,436.23,346.473,434.219,344.467z"
      />
      <path
        style={{ fill: "#fafafc" }}
        d="M85.333,512.019c-1.337-0.002-2.661-0.255-3.904-0.747c-4.078-1.604-6.76-5.538-6.763-9.92V10.686  C74.656,4.795,79.423,0.011,85.314,0c2.84-0.005,5.565,1.123,7.571,3.134l341.333,341.333c4.171,4.16,4.179,10.914,0.019,15.085  c-2.006,2.011-4.731,3.139-7.571,3.134H228.651L93.141,508.606C91.126,510.779,88.297,512.016,85.333,512.019z M96,36.435v437.76  l120.192-129.429c2.015-2.173,4.844-3.41,7.808-3.413h176.917L96,36.435z"
      />
    </svg>
  );
}

function Mice(projectPath) {
  const [collaborateState, updateCollaborate] = useCollaborateState(projectPath + ".mice");

  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      updateCollaborate({ x: ev.pageX, y: ev.pageY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return Object.keys(collaborateState.data)
    .filter((key) => {
      if (key === collaborateState.connectionId) return false;

      return (
        Number.isFinite(collaborateState.data[key].x) &&
        Number.isFinite(collaborateState.data[key].y)
      );
    })
    .map((key, i) => (
      <Mouse x={collaborateState.data[key].x} y={collaborateState.data[key].y} fill={colors[i]} />
      // <div
      //   style={{
      //     position: "absolute",
      //     top: collaborateState.data[key].y,
      //     left: collaborateState.data[key].x,
      //     width: 10,
      //     height: 10,
      //     background: "red",
      //   }}
      // >
      // </div>
    ));
}

export default Mice;
