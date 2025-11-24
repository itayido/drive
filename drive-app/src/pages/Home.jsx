import { useState, useEffect } from "react";
import { useParams } from "react-router";

function Home() {
  const [files, setFiles] = useState([]);
  const [openFile, setOpenFile] = useState(null);
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

  return (
    <>
      {files.map((file, index) => {
        const isOpen = openFile?.name === file.name;

        return (
          <div key={index}>
            <p>
              {file.name} type: {file.type}
            </p>

            <button onClick={() => deleteFile(file.name)}>Delete</button>
            {file.type === "file" && (
              <button onClick={() => toggleFile(file)}>
                {isOpen ? "Hide Content" : "Show Content"}
              </button>
            )}
            {isOpen && (
              <div>
                {openFile.content === "" ? (
                  <p>This file is empty.</p>
                ) : (
                  openFile.content
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default Home;
