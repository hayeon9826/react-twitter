import { useState } from "react";

import { app } from "firebaseApp";
import { getAuth } from "firebase/auth";
import Router from "pages/Router";

function App() {
  const auth = getAuth(app);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth?.currentUser);

  return <Router />;
}

export default App;
