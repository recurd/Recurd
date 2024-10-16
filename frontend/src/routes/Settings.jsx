import { useSearchParams } from "react-router-dom"
import SpotifyConnectButton from "../components/SpotifyConnectButton"

function Settings() {
  const [searchParams] = useSearchParams()

  // When user presses connect on any connect services button, we redirect them to the service.
  // Then when the service redirects back, it goes to the service loader
  // Which interprets the response, notifies the backend, and redirects the user here
  // With search params indicating success/failure
  if (searchParams.get("success") === "false") {
    // TODO: better display
    window.alert(`Connecting to ${searchParams.get("service_type")} failed with message: ${searchParams.get("message")}`)
  }
  return (
    <div>
      {/* Header for the Settings Page */}
      <h2>Settings</h2>

      {/* Placeholder for logout button */}
      {/* TODO: Implement logout functionality */}

      {/* Placeholder for connecting to Spotify */}
      <SpotifyConnectButton />
      {/* Placeholder for additional settings (if needed) */}
      {/* TODO: Add other user settings (e.g., profile visibility, notifications) */}
    </div>
  );
}

export default Settings;
