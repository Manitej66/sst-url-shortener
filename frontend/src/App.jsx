import { useState } from "react";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const shortenUrl = async () => {
    setLoading(true);
    const { data } = await axios.get(
      import.meta.env.VITE_APP_API_URL + `/shorten?og_url=${url}`
    );
    setData(import.meta.env.VITE_APP_API_URL + "/" + data.short_url);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <input
        type="text"
        onChange={(e) => setUrl(e.target.value.trim())}
        placeholder="Enter URL"
      />
      <button disabled={loading} onClick={shortenUrl}>
        {loading ? "Shortening..." : "Shorten"}
      </button>
      {data && (
        <div className="result">
          <code>{data}</code>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            onClick={async () => {
              await navigator.clipboard.writeText(data);
              alert("Copied to clipboard");
            }}
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M2 4C2 2.89543 2.89543 2 4 2H14C15.1046 2 16 2.89543 16 4V8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H10C8.89543 22 8 21.1046 8 20V16H4C2.89543 16 2 15.1046 2 14V4ZM10 16V20H20V10H16V14C16 15.1046 15.1046 16 14 16H10ZM14 14V4L4 4V14H14Z"
              fill="#ccc"
            ></path>
          </svg>
        </div>
      )}
      <a
        className="footer"
        href="https://github.com/serverless-stack/serverless-stack"
      >
        Made with SST ⚡️
      </a>
    </div>
  );
}
