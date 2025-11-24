import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router";

function Home() {
  const [files, setFiles] = useState([]);
  const [openFile, setOpenFile] = useState(null);
  const [openInfo, setOpenInfo] = useState(null);
  const [renameInputs, setRenameInputs] = useState({});
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const subPath = location.pathname.replace(`/home/${username}`, "");

  useEffect(() => {
    async function fetchitems() {
      try {
        const pathPart = subPath ? `${subPath}` : "";
        const response = await fetch(
          `http://localhost:3000/files/${username}${pathPart}/`
        );
        const data = await response.json();
        if (!response.ok) throw new Error("something went wrong");
        setFiles(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchitems();
  }, [username, subPath]);

  async function deleteFile(file) {
    try {
      const pathPart = subPath ? `${subPath}` : "";
      await fetch(
        `http://localhost:3000/files/${username}/${pathPart}/${file}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      setFiles((prev) => prev.filter((f) => f.name !== file));

      if (openFile?.name === file) {
        setOpenFile(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function copyFile(fileName) {
    try {
      const response = await fetch(
        `http://localhost:3000/files/${username}/${fileName}/copy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return alert(data.error || "Could not copy file.");
      }

      setFiles((prev) => [...prev, { name: data.newFile, type: "file" }]);
    } catch (err) {
      console.log(err);
    }
  }

  async function renameFile(oldName, newName) {
    try {
      const pathPart = subPath ? `${subPath}` : "";
      const response = await fetch(
        `http://localhost:3000/files/${username}/${pathPart}/${oldName}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return alert(error.error || "Rename failed");
      }

      setFiles((prev) =>
        prev.map((f) => (f.name === oldName ? { ...f, name: newName } : f))
      );

      if (openFile?.name === oldName) setOpenFile(null);
      if (openInfo?.name === oldName) setOpenInfo(null);
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleFile(file) {
    if (openFile?.name === file.name) {
      setOpenFile(null);
      return;
    }
    const pathPart = subPath ? `${subPath}` : "";

    try {
      const response = await fetch(
        `http://localhost:3000/files/${username}/${pathPart}/${file.name}`
      );
      const data = await response.text();

      setOpenFile({ name: file.name, content: data });
    } catch (err) {
      console.log(err);
    }
  }

  async function toggleInfo(file) {
    if (openInfo?.name === file.name) {
      setOpenInfo(null);
      return;
    }
    const pathPart = subPath ? `${subPath}` : "";

    try {
      const response = await fetch(
        `http://localhost:3000/files/${username}${pathPart}/${file.name}/info`
      );
      const data = await response.json();

      setOpenInfo({ name: file.name, info: data });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          localStorage.setItem("ActiveUser", {});
          navigate("/login");
        }}
      >
        Logout
      </button>
      {files.map((file, index) => {
        const isFileOpen = openFile?.name === file.name;
        const isInfoOpen = openInfo?.name === file.name;

        return (
          <div key={index}>
            {file.type === "file" ? (
              <p>
                {file.name} type: {file.type}
              </p>
            ) : (
              <Link to={`./${file.name}`}>
                {file.name} type: {file.type}
              </Link>
            )}

            <input
              type="text"
              value={renameInputs[file.name] || ""}
              onChange={(e) =>
                setRenameInputs((prev) => ({
                  ...prev,
                  [file.name]: e.target.value,
                }))
              }
            />
            <button
              onClick={() =>
                renameFile(file.name, renameInputs[file.name] || "")
              }
            >
              Rename
            </button>

            <button onClick={() => deleteFile(file.name)}>Delete</button>

            <button onClick={() => toggleInfo(file)}>
              {isInfoOpen ? "Hide Info" : "Info"}
            </button>

            {file.type === "file" && (
              <>
                <button onClick={() => copyFile(file.name)}>Copy</button>
                <button onClick={() => toggleFile(file)}>
                  {isFileOpen ? "Hide Content" : "Show Content"}
                </button>
              </>
            )}

            {isFileOpen && (
              <div>
                {openFile.content === "" ? (
                  <p>This file is empty</p>
                ) : (
                  openFile.content
                )}
              </div>
            )}

            {isInfoOpen && (
              <div>
                <p>Size: {openInfo.info.sizeBytes} bytes</p>
                <p>Created: {openInfo.info.created}</p>
                <p>
                  Last Modified:
                  {openInfo.info.lastModified}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Home;
