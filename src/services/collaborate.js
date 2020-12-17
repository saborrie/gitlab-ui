// import React from "react";
// import * as signalR from "@microsoft/signalr";

// let connection = new signalR.HubConnectionBuilder()
//   .withUrl("http://localhost:5000/collaborate")
//   .build();

// connection.on("Log", (data) => {
//   console.log(data);
// });

// // const states = {};

// // connection.on("Update", (groupName, user, state) => {
// //   states[groupName] = states[groupName] || {};
// //   states[groupName][user] = JSON.parse(state);
// // });

// export const started = connection.start();

// export function useCollaborateState(groupName) {
//   const [groupState, setGroupState] = React.useState({
//     connectionId: connection.connectionId,
//     groupName,
//     data: {},
//   });

//   React.useEffect(() => {
//     function handleUpdate(eventGroupName, user, state) {
//       if (groupName === eventGroupName) {
//         setGroupState((x) => ({ ...x, data: { ...x.data, [user]: JSON.parse(state) } }));
//       }
//     }

//     connection.on("Update", handleUpdate);
//     return () => connection.off("Update", handleUpdate);
//   }, [groupName]);

//   return [
//     groupState,
//     async (state) => {
//       await started;
//       connection.invoke("Update", groupName, JSON.stringify(state));
//     },
//   ];
// }
