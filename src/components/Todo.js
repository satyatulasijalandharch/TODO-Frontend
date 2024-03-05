import axios from "axios";
import React, { useEffect, useState } from "react";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;// || "http://back-end-svc"; //|| "https://api.mrstjch.com";

  const handleErrors = (error) => {
    console.error("Error:", error);
    setConnectionStatus("Failed to connect to the backend");
  };

  const statusOptions = [
    "Pending/To-Do",
    "In Progress/Doing",
    "Completed/Done",
    "Overdue/Late",
    "Blocked/On Hold",
    "Canceled/Rejected",
    "Deferred",
    "Review",
    "Testing/QA",
    "Backlog",
  ];

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get(`${backendUrl}/getTodoList`)
      .then((result) => {
        setTodoList(result.data);
        setConnectionStatus("Connected to backend");
        setLoading(false);
      })
      .catch(handleErrors);
  }, [backendUrl]);

  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data._id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(rowData.deadline || "");
    } else {
      setEditableId(null);
      setEditedTask("");
      setEditedStatus("");
      setEditedDeadline("");
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    axios
      .post(`${backendUrl}/addTodoList`, {
        task: newTask,
        status: newStatus,
        deadline: newDeadline,
      })
      .then((res) => {
        console.log(res);
        // Update the state with the new task
        setTodoList([...todoList, res.data]);
        setNewTask("");
        setNewStatus("");
        setNewDeadline("");
        setConnectionStatus("Task added successfully");
        setLoading(false); // Set loading to false to trigger a re-render
      })
      .catch(handleErrors);
  };

  const deleteTask = (id) => {
    axios
      .delete(`${backendUrl}/deleteTodoList/${id}`)
      .then((result) => {
        console.log(result);
        setConnectionStatus("Task deleted successfully");
        // Remove the deleted task from the state
        const updatedTodoList = todoList.filter((task) => task._id !== id);
        console.log("Updated Todo List:", updatedTodoList);
        setTodoList(updatedTodoList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        setConnectionStatus("Failed to delete task");
        setLoading(false);
      });
  };

  const saveEditedTask = (id) => {
    const editedData = {
      task: editedTask,
      status: editedStatus,
      deadline: editedDeadline,
    };

    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    axios
      .post(`${backendUrl}/updateTodoList/${id}`, editedData)
      .then((result) => {
        console.log(result);
        // Update the state with the edited task
        setTodoList((prevTodoList) => {
          const updatedTodoList = prevTodoList.map((task) =>
            task._id === id ? { ...task, ...editedData } : task
          );
          return updatedTodoList;
        });
        setEditableId(null);
        setEditedTask("");
        setEditedStatus("");
        setEditedDeadline("");
        setConnectionStatus("Task updated successfully");
      })
      .catch(handleErrors)
      .finally(() => {
        setLoading(false);
      });
  };

  function isDeadlinePassed(deadline) {
    if (!deadline) {
      return false;
    }

    const deadlineDate = new Date(deadline);
    const currentDate = new Date();

    return deadlineDate < currentDate;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div
            className={`alert ${loading ? "alert-info" : "alert-success"}`}
            role="alert"
          >
            {loading ? "Loading tasks..." : connectionStatus}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7">
          <h2 className="text-center">Todo List</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {Array.isArray(todoList) ? (
                <tbody>
                  {todoList.map((data) => (
                    <tr key={data._id}>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                          />
                        ) : (
                          data.task
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <select
                            className="form-control"
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                          >
                            <option value="" disabled>
                              Select Status
                            </option>
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          data.status
                        )}
                      </td>
                      <td
                        className={
                          isDeadlinePassed(data.deadline)
                            ? "deadline-passed"
                            : ""
                        }
                      >
                        {editableId === data._id ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editedDeadline}
                            onChange={(e) => setEditedDeadline(e.target.value)}
                          />
                        ) : data.deadline ? (
                          new Date(data.deadline).toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                            hour12: true,
                          })
                        ) : (
                          ""
                        )}
                      </td>

                      <td>
                        {editableId === data._id ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => saveEditedTask(data._id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => toggleEditable(data._id)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm ml-1"
                          onClick={() => deleteTask(data._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="4">Loading tasks...</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
        <div className="col-md-5">
          <h2 className="text-center">Add Task</h2>
          <form className="bg-light p-4">
            <div className="mb-3">
              <label>Task</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-control"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="" disabled>
                  Select Status
                </option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Deadline</label>
              <input
                className="form-control"
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <button onClick={addTask} className="btn btn-success btn-sm">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Todo;
