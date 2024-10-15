import { useParams } from "react-router-dom";

function Artist() {
  const { id } = useParams() // this is artist id
  return (
    <div>
      {/* Header for the Artist Page */}
      <h2>Artist Details</h2>
      
      {/* Placeholder for displaying artist's albums */}
      {/* TODO: Implement grid view of artist's albums */}
      
      {/* Placeholder for the ratings graph */}
      {/* TODO: Implement ratings graph based on user feedback */}
    </div>
  );
}

export default Artist;
