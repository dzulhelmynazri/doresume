import { redirect } from "next/navigation";

const Home = () => {
  redirect("/auth");
};

export default Home;
