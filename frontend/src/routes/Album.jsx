import { useParams } from "react-router-dom";

function Album() {
  const { id } = useParams() // this is album id
  return (
    <div>
      {/* Header for the album Page */}
      <h2>Album Details</h2>
    </div>
  );
}

export default Album
