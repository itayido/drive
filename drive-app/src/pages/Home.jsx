import { useState } from "react";
import { useEffect } from "react";

function Home() {
  const [data, setData] = useState("");
  const username = "tohar";
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
  }, []);
  return <h1>{data}</h1>;
}
export default Home;
