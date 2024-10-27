import { useParams } from "react-router-dom";
import TopSongs from "../components/TopSongs";

function Profile() {
  const { id } = useParams() // this is user's id
  return (
    <div>
      {/* Header for the Profile Page */}
      <h2>User Profile</h2>
      
      {/* Placeholder for the profile description */}
      {/* TODO: Display user's profile information */}
      
      {/* Placeholder for the edit profile button (if viewing own profile) */}
      {/* TODO: Implement edit button for logged-in users */}
      
      {/* Placeholder for the recent listens */}
      {/* TODO: Add a section to show user's recent listens */}
      
      {/* Placeholder for the reviews */}
      {/* TODO: Display user's reviews */}
    </div>
  );
}

export default Profile;
