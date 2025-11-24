import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Home() {
  const [data, setData] = useState("");
  const { username } = useParams();

  useEffect(() => {
    async function fetchitems() {
      try {
        const response = await fetch(`http://localhost:3000/files/${username}`);
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchitems();
  }, [username]);

  return <h1>{data}</h1>;
}
export default Home;
