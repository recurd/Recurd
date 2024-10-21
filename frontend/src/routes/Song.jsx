import { useParams } from "react-router-dom";

function Song() {
  const { id } = useParams() // this is song id
    return (
      <div>
        {/* Header for the song Page */}
        <h2>Song Details</h2>
      </div>
    );
  }
  
  export default Song
  