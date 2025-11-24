import { useState, useEffect } from "react";
import { useParams } from "react-router";

function Home() {
  const [files, setFiles] = useState([]);
  const [openFile, setOpenFile] = useState(null);
  const [openInfo, setOpenInfo] = useState(null);
  const [renameInputs, setRenameInputs] = useState({});

  const { username } = useParams();

  useEffect(() => {
    async function fetchitems() {
      try {
        const response = await fetch(`http://localhost:3000/files/${username}`);
        const data = await response.json();
        if (!response.ok) throw new Error("something went wrong");
        setFiles(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchitems();
  }, [username]);

  async function deleteFile(file) {
    try {
      await fetch(`http://localhost:3000/files/${username}/${file}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

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
      const response = await fetch(
        `http://localhost:3000/files/${username}/${oldName}`,
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

    try {
      const response = await fetch(
        `http://localhost:3000/files/${username}/${file.name}`
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

    try {
      const response = await fetch(
        `http://localhost:3000/files/${username}/${file.name}/info`
      );
      const data = await response.json();

      setOpenInfo({ name: file.name, info: data });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {files.map((file, index) => {
        const isFileOpen = openFile?.name === file.name;
        const isInfoOpen = openInfo?.name === file.name;

        return (
          <div key={index}>
            <p>
              {file.name} type: {file.type}
            </p>

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
                  <p>This file is empty.</p>
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
