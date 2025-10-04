import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Example: automatically redirect to /app/login if not authenticated
    const isAuthenticated = false; // replace with real auth logic
    if (!isAuthenticated) {
      navigate("/app/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
export default App;
