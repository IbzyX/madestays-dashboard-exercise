import Dashboard from "./components/Dashboard";
import data from "./data/onboarding-data.json";

export default function Home() {
  return <Dashboard data={data} />;
}